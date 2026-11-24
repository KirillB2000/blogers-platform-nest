import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../infrastructure/users.repository.js";
import { EmailService } from "../../../notification/email.service.js";
import { BadRequestException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { add } from "date-fns";

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

        if (userByEmail.isConfirmed) {
            throw new BadRequestException([{ message: 'Email already confirmed', field: 'email' }])
        }

        const confirmationCode = randomUUID() as string
        const expirationDate = add(new Date(), { minutes: 5 })

        await this.usersRepository.updateConfirmationCode(userByEmail.id, confirmationCode, expirationDate)

        this.emailService // TODO: create EventHandler for email
            .sendConfirmationEmail(userByEmail.email, confirmationCode)
            .catch(console.error)
    }
}