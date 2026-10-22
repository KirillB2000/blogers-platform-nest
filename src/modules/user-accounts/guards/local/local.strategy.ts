import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../../application/auth.service.js";
import { Strategy } from "passport-local"
import { PassportStrategy } from '@nestjs/passport';
import { UserContextDto } from "../dto/user-context.dto.js";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ 
            usernameField: 'loginOrEmail',
            passwordField: 'password'
        });
    }

    //validate возвращает то, что впоследствии будет записано в req.user
    async validate(
        username: string, 
        password: string
    ): Promise<UserContextDto> {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException('Unauthorized')
        }

        return {id: user._id.toString()};
    }
}