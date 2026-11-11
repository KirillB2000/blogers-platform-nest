import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { TokensCredsAppDto as TokensCredsAppDto } from "../dto/tokens-creds.app.dto.js";
import { AuthConfig } from "../../config/auth.config.js";
import { randomUUID } from "crypto";
import { InjectModel } from "@nestjs/mongoose";
import { SecurityDevices, type SercurityDevicesModelType } from "../../domain/security-devices.entity.js";
import { CreateSercurityDevicesDomainDto } from "../../domain/dto/createSercurityDevicesDomainDto.js";
import { SecurityDevicesRepository } from "../../infrastructure/sercurity-devices.repository.js";

export class LoginUserCommand {
    constructor (
        public userId: string,
        public ipAddress: string,
        public deviceName: string
    ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand, TokensCredsAppDto>{
    
    constructor (
        @InjectModel(SecurityDevices.name)
        private SecurityDevicesModel: SercurityDevicesModelType,
        
        private jwtService: JwtService,
        private authConfig: AuthConfig,
        private securityDevicesRepository: SecurityDevicesRepository
    ) {

    }
    
    async execute(
        command: LoginUserCommand
    ): Promise<TokensCredsAppDto> {
        const { userId, deviceName, ipAddress } = command
        const deviceId = randomUUID() as string

        const accessTokenPayload = { sub: userId, jti: randomUUID() as string }

        const accessToken = this.jwtService.sign(
            accessTokenPayload,
            {
                secret: this.authConfig.jwtAccessSecret,
                expiresIn: this.authConfig.jwtAccessTokenExpirationTimeInSec
            }
        )

        const isseudAtSeconds = Math.floor(Date.now() / 1000)

        const refreshTokenPayload = {
            userId,
            deviceId,
            jti: randomUUID() as string,
            iat: isseudAtSeconds
        }

        const refreshToken = this.jwtService.sign(
            refreshTokenPayload, 
            {
                secret: this.authConfig.jwtRefreshSecret,
                expiresIn: this.authConfig.jwtRefreshTokenExpirationTimeInSec
            }
        )

        const expiredAt = new Date( (isseudAtSeconds + this.authConfig.jwtRefreshTokenExpirationTimeInSec) * 1000)
        const issuedAt = isseudAtSeconds * 1000

        const securityDevicesDomainDto = CreateSercurityDevicesDomainDto
            .mapToDomain(
                userId, 
                deviceId, 
                issuedAt, 
                deviceName, 
                ipAddress, 
                expiredAt
        )

        const securityDevicesDoc = this.SecurityDevicesModel.createInstance(securityDevicesDomainDto)

        await this.securityDevicesRepository.save(securityDevicesDoc)

        return { accessToken, refreshToken }
    }
}