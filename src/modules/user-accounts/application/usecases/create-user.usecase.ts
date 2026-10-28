import { InjectModel } from "@nestjs/mongoose";
import { User, type UserModelType } from "../../domain/user.entity.js";
import { UsersRepository } from "../../infrastructure/users.repository.js";
import { PasswordService } from "../adapters/password.service.js";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserAppDto } from "../dto/create-user.app-dto.js";

export class CreateUserCommand { // Command with all essential date for execute the command
    constructor(
        public dto: CreateUserAppDto
    ) {}
}

@CommandHandler(CreateUserCommand) // indicate that CreateUserUseCase class is CreateUserCommand handler
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand, string> { // interface ICommandHandler used for strict typing (CreateUserCommand when enter execute() method and string on the exit)
    constructor (
        @InjectModel(User.name)
        private UserModel: UserModelType,
        private usersRepository: UsersRepository,
        private passwordService: PasswordService
    ) {}

    async execute(
        command: CreateUserCommand
    ): Promise<string> {

        const { dto } = command

        const passwordHash = await this.passwordService.hashPassword(dto.password)

        const user = this.UserModel.createInstance({
            email: dto.email,
            login: dto.login,
            passwordHash: passwordHash,
        })

        await this.usersRepository.save(user)

        return user.id
    }
}