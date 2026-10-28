import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../infrastructure/users.repository.js";
import { BadRequestException } from "@nestjs/common";

export class EmailConfirmationCommand {
    constructor (
        public code: string
    ) {}
}

@CommandHandler(EmailConfirmationCommand)
export class EmailConfirmationUseCase implements ICommandHandler<EmailConfirmationCommand, void> {

    constructor (
        private usersRepository: UsersRepository
    ) {}

    async execute(
        command: EmailConfirmationCommand
    ): Promise<void> {
        const { code } = command

        const userByCode = await this.usersRepository.findUserByConfirmationCode(code)

        if (!userByCode) {
            throw new BadRequestException([{ message: 'Code should be correct and exist in the system', field: 'code' }])
        }

        userByCode.confirmEmail()

        await this.usersRepository.save(userByCode)
    }
}