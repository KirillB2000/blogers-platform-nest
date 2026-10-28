import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UserDocument } from "../../domain/user.entity.js";
import { UsersRepository } from "../../infrastructure/users.repository.js";
import { PasswordService } from "../adapters/password.service.js";

export class ValidateUserQuery {
    constructor (
        public loginOrEmail: string,
        public password: string
    ) {}
}

@QueryHandler(ValidateUserQuery)
export class ValidateUserHanlder implements IQueryHandler<ValidateUserQuery, UserDocument | null> {
    
    constructor(
        private usersRepository: UsersRepository,
        private passwordSerivce: PasswordService
    ) { }
    
    async execute(
        query: ValidateUserQuery
    ): Promise<UserDocument | null> {
        const loginOrEmail = query.loginOrEmail
        const password = query.password

        const user = await this.usersRepository.findByLoginOrEmailField(loginOrEmail)
        if (!user) return null

        const isPasswordCorrect = await this.passwordSerivce.verifyPassword(password, user.passwordHash)
        if (!isPasswordCorrect) return null

        return user;
    }
}