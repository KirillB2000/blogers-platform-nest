import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../infrastructure/users.repository.js";
import { EmailService } from "../../../notification/email.service.js";
import { BadRequestException } from "@nestjs/common";

export class EmailResendingCommand {
    constructor (
        public email: string
    ) {}
}

@CommandHandler(EmailResendingCommand)
export class EmailResendingUseCase implements ICommandHandler<EmailResendingCommand, void> {
    constructor (
        private usersRepository: UsersRepository,
        private emailService: EmailService
    ) {}

    async execute(
        command: EmailResendingCommand
    ): Promise<void> {
        const { email } = command

        const userByEmail = await this.usersRepository.findByEmail(email)

        if (!userByEmail) {
            throw new BadRequestException([{ message: 'Email should be in the system and should be correct', field: 'email' }])
        }

        userByEmail.updateConfirmationCode()

        await this.usersRepository.save(userByEmail)

        this.emailService
            .sendConfirmationEmail(userByEmail.email, userByEmail.emailConfirmationInfo.confirmationCode)
            .catch(console.error)
    }
}