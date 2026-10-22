import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserContextDto } from "../dto/user-context.dto.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_SECRET || 'fallback-secret'
        })
    }

    async validate(
        payload: any
    ): Promise<UserContextDto> {
        return { id: payload.id || payload.sub };
    }
}