    import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../infrastructure/users.repository.js";
import { BadRequestException } from "@nestjs/common";
import { isAfter } from "date-fns";

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

        if (userByCode.isConfirmed) {
            throw new BadRequestException([{ message: 'Email already confirmed', field: 'code' }])
        }

        if (!userByCode.emailExpirationDate || isAfter(new Date(), userByCode.emailExpirationDate)) {
            throw new BadRequestException([{ message: 'Code expired', field: 'code' }])
        }

        await this.usersRepository.updateIsConfirmedByUserId(userByCode.id)
    }
}