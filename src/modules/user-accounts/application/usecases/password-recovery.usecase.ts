import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../infrastructure/users.repository.js";
import { EmailService } from "../../../notification/email.service.js";

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

        const recoveryCode = userByEmail.updateRecoveryCode()

        await this.usersRepository.save(userByEmail)

        this.emailService // TODO: create EventHandler for email
            .sendRecoveryPassword(recoveryCode, userByEmail.email)
            .catch(console.error)
    }
}