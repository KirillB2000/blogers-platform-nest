import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-local"
import { PassportStrategy } from '@nestjs/passport';
import { UserContextDto } from "../dto/user-context.dto.js";
import { QueryBus } from "@nestjs/cqrs";
import { ValidateUserQuery } from "../../application/queries/validate-user.query.js";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private queryBus: QueryBus
    ) {
        super({ 
            usernameField: 'loginOrEmail',
            passwordField: 'password'
        });
    }

    //validate возвращает то, что впоследствии будет записано в req.user
    async validate(
        loginOrEmail: string, 
        password: string
    ): Promise<UserContextDto> {
        const user = await this.queryBus.execute(new ValidateUserQuery(loginOrEmail, password))
        if (!user) {
            throw new UnauthorizedException('Unauthorized')
        }

        return {id: user._id.toString()};
    }
}