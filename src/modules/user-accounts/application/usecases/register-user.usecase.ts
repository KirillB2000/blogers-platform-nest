import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { EmailService } from '../../../notification/email.service.js';
import { CreateUserDomainDto } from '../../domain/dto/create-user.domain.js';
import { User, type UserModelType } from '../../domain/user.entity.js';
import { UsersRepository } from '../../infrastructure/users.repository.js';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordService } from '../adapters/password.service.js';
import { UserInputAppDto } from '../dto/user-input.app-dto.js';

export class RegisterUserCommand {
    constructor (
        public userInput: UserInputAppDto
    ) {} 
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase implements ICommandHandler<RegisterUserCommand, void> {

    constructor (
        @InjectModel(User.name)
        private UserModel: UserModelType,
        private usersRepository: UsersRepository,
        private emailService: EmailService,
        private passwordService: PasswordService
    ) {

    }

    async execute(
        command: RegisterUserCommand
    ): Promise<void> {
        const { userInput } = command

        const login = await this.usersRepository.findByLogin(userInput.login)

        if (login) {
            throw new BadRequestException([{ message: 'Login must be unique', field: 'login' }])
        }

        const email = await this.usersRepository.findByEmail(userInput.email)

        if (email) {
            throw new BadRequestException([{ message: 'Email must be unique', field: 'email' }])
        }

        const passwordHash = await this.passwordService.hashPassword(userInput.password)

        const dtoForUserCreation = CreateUserDomainDto.mapToDomain(userInput, passwordHash)

        const user = this.UserModel.createInstance(dtoForUserCreation)

        await this.usersRepository.save(user)

        this.emailService
            .sendConfirmationEmail(user.email, user.emailConfirmationInfo.confirmationCode)
            .catch(console.error)
    }
}