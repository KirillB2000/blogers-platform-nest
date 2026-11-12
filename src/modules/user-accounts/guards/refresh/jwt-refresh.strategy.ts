import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { AuthConfig } from "../../config/auth.config.js";
import { SecurityDevicesRepository } from "../../infrastructure/sercurity-devices.repository.js";
import { RefreshTokenPayload } from "../../application/dto/jwt-payload-sessions.js";
import { Request } from "express";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersRepository } from "../../infrastructure/users.repository.js";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private authConfig: AuthConfig,
        private securityDevicesRepository: SecurityDevicesRepository,
        private usersRepository: UsersRepository
    ) {
        super({
            jwtFromRequest: (req: Request) => {
                return req?.cookies?.refreshToken || null
            },
            ignoreExpiration: false,
            secretOrKeyProvider: (request, rawJwtToken, done) => {
                done(null, this.authConfig.jwtRefreshSecret)
            }
        })
    }

    async validate(payload: RefreshTokenPayload) {
        const issuedAt = payload.iat * 1000;

        // Проверяем, не была ли эта сессия уже отозвана или обновлена, а также проверяем наличие юзера
        const [user, session] = await Promise.all([
            this.usersRepository.countUsersById(payload.userId),
            this.securityDevicesRepository.findSession(
                issuedAt,
                payload.deviceId,
                payload.userId,
            )
        ])

        if (!session || !user) {
            throw new UnauthorizedException('Session not found or expired');
        }

        // Возвращаем данные, которые попадут в req.user
        return {
            userId: payload.userId,
            deviceId: payload.deviceId,
            iat: payload.iat,
        };
    }
}
