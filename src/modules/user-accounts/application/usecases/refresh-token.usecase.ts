import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "../../infrastructure/users.repository.js";
import { AuthConfig } from "../../config/auth.config.js";
import { randomUUID } from "crypto";
import { SecurityDevicesRepository } from "../../infrastructure/sercurity-devices.repository.js";
import { TokensCredsAppDto } from "../dto/tokens-creds.app.dto.js";

export class RefreshTokenCommand {
    constructor (
        // all three parametrs came from jwt refresh strategy
        public userId: string,
        public deviceId: string,
        public iat: number
    ) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase implements ICommandHandler<RefreshTokenCommand, TokensCredsAppDto> {
    constructor (
        private jwtService: JwtService,
        private authConfig: AuthConfig,
        private securityDevicesRepository: SecurityDevicesRepository
    ) {}

    async execute(
        command: RefreshTokenCommand
    ): Promise<TokensCredsAppDto> {

        const { deviceId, iat, userId } = command

        const issuedAtOld = iat * 1000

        const authSessionDoc = await this.securityDevicesRepository.findSession(issuedAtOld, deviceId, userId)

        if (!authSessionDoc) {
            throw new UnauthorizedException('Unauthorized')
        }

        // Create new refresh jwt token

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

        const expiredAt = new Date((isseudAtSeconds + this.authConfig.jwtRefreshTokenExpirationTimeInSec) * 1000)
        const issuedAt = isseudAtSeconds * 1000

        authSessionDoc.updateSession(issuedAt, expiredAt)

        await this.securityDevicesRepository.save(authSessionDoc)
        
        // Create new access token

        const accessTokenPayload = { sub: userId, jti: randomUUID() as string }

        const accessToken = this.jwtService.sign(
            accessTokenPayload,
            {
                secret: this.authConfig.jwtAccessSecret,
                expiresIn: this.authConfig.jwtAccessTokenExpirationTimeInSec
            }
        )

        return { accessToken, refreshToken}

    }
}