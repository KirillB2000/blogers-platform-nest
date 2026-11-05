import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { TokensCredsAppDto as TokensCredsAppDto } from "../dto/tokens-creds.app.dto.js";

export class LoginUserCommand {
    constructor (
        public userId: string
    ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand, TokensCredsAppDto>{
    
    constructor (
        private jwtService: JwtService
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
                secret: process.env.JWT_ACCESS_SECRET || 'fallback-access-secret',
                expiresIn: '5m'
            }
        )

        const refreshToken = this.jwtService.sign(
            { sub: userId, deviceId: 'fallback-device' }, //TODO: change deiveId later
            {
                secret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
                expiresIn: '20d'
            }
        )

        return { accessToken, refreshToken }
    }
}