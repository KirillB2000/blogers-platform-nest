import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../../../domain/user.entity.js";
import { UsersRepository } from "../../../infrastructure/users.repository.js";
import { PasswordService } from "../../adapters/password.service.js";
import { CreateUserAppDto } from "../../dto/create-user.app-dto.js";

export class CreateUserCommand { // Command with all essential date for execute the command
    constructor(
        public dto: CreateUserAppDto
    ) {}
}

@CommandHandler(CreateUserCommand) // indicate that CreateUserUseCase class is CreateUserCommand handler
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand, number> { // interface ICommandHandler used for strict typing (CreateUserCommand when enter execute() method and string on the exit)
    constructor (
        private usersRepository: UsersRepository,
        private passwordService: PasswordService
    ) {}

    async execute(
        command: CreateUserCommand
    ): Promise<number> {

        const { dto } = command

        const passwordHash = await this.passwordService.hashPassword(dto.password)

        const userId = await this.usersRepository.createUserByAdmin (dto.login, dto.email, passwordHash)

        return userId
    }
}