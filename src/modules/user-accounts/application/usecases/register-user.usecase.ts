import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { EmailService } from '../../../notification/email.service.js';
import { UsersRepository } from '../../infrastructure/users.repository.js';
import { PasswordService } from '../adapters/password.service.js';
import { UserInputAppDto } from '../dto/user-input.app-dto.js';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';

export class RegisterUserCommand {
    constructor (
        public userInput: UserInputAppDto
    ) {} 
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase implements ICommandHandler<RegisterUserCommand, void> {

    constructor (
        private usersRepository: UsersRepository,
        private emailService: EmailService,
        private passwordService: PasswordService
    ) {

    }

    async execute(
        command: RegisterUserCommand
    ): Promise<void> {
        const { userInput } = command

        const userByLogin = await this.usersRepository.findByLogin(userInput.login)

        if (userByLogin) {
            throw new BadRequestException([{ message: 'Login must be unique', field: 'login' }])
        }

        const userByEmail = await this.usersRepository.findByEmail(userInput.email)

        if (userByEmail) {
            throw new BadRequestException([{ message: 'Email must be unique', field: 'email' }])
        }

        const passwordHash = await this.passwordService.hashPassword(userInput.password)
        const confirmationCode = randomUUID() as string
        const expirationDate = add(new Date(), { minutes: 5 })

        await this.usersRepository.registrateAndCreateUnconfirmedUser(
            userInput.login, 
            userInput.email, 
            passwordHash, 
            confirmationCode, 
            expirationDate
        )

        this.emailService // TODO: create EventHandler for email?
            .sendConfirmationEmail(userInput.email, confirmationCode)
            .catch(console.error)
    }
}