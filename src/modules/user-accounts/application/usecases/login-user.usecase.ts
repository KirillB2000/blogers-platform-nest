import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { TokensCredsAppDto as TokensCredsAppDto } from "../dto/tokens-creds.app.dto.js";
import { AuthConfig } from "../../config/auth.config.js";

export class LoginUserCommand {
    constructor (
        public userId: string
    ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand, TokensCredsAppDto>{
    
    constructor (
        private jwtService: JwtService,
        private authConfig: AuthConfig
    ) {

    }
    
    async execute(
        command: LoginUserCommand
    ): Promise<TokensCredsAppDto> {
        const { userId } = command

        const payload = { sub: userId }
        const accessToken = this.jwtService.sign(
            payload,
            {
                secret: this.authConfig.jwtAccessSecret,
                expiresIn: '5m'
            }
        )

        const refreshToken = this.jwtService.sign(
            { sub: userId, deviceId: 'fallback-device' }, //TODO: change deiveId later
            {
                secret: this.authConfig.jwtRefreshSecret,
                expiresIn: '20d'
            }
        )

        return { accessToken, refreshToken }
    }
}