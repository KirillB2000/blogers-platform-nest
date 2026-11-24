import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../infrastructure/users.repository.js";
import { EmailService } from "../../../notification/email.service.js";
import { randomUUID } from "crypto";
import { add } from "date-fns";

export class PasswordRecoveryCommand {
    constructor (
        public email: string
    ) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase implements ICommandHandler<PasswordRecoveryCommand, void> {
    constructor (
        private usersRepository: UsersRepository,
        private emailService: EmailService
    ) {}

    async execute(
        command: PasswordRecoveryCommand
    ): Promise<void> {
        const { email } = command

        const userByEmail = await this.usersRepository.findByEmail(email)

        if (!userByEmail) {
            return
        }

        const recoveryCode = randomUUID() as string
        const expirationDate = add(new Date(), { minutes: 5 })

        await this.usersRepository.updateRecoveryCode(userByEmail.id, recoveryCode, expirationDate)

        this.emailService // TODO: create EventHandler for email
            .sendRecoveryPassword(recoveryCode, userByEmail.email)
            .catch(console.error)
    }
}