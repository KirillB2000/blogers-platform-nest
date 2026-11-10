import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserContextDto } from "../dto/user-context.dto.js";
import { AuthConfig } from "../../config/auth.config.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private authConfig: AuthConfig
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKeyProvider: (request, rawJwtToken, done) => {
                done(null, this.authConfig.jwtAccessSecret)
            }
        })
    }

    async validate(
        payload: any
    ): Promise<UserContextDto> {
        return { id: payload.id || payload.sub };
    }
}