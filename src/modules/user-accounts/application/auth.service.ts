import { BadRequestException, Injectable } from '@nestjs/common';
import { UserInputModel } from '../api/inputDto/uesrs.input-dto.js';
import { UsersRepository } from '../infrastructure/users.repository.js';
import bcrypt from 'bcrypt'
import { User, type UserModelType } from '../domain/user.entity.js';
import { InjectModel } from '@nestjs/mongoose';
import { EmailService } from '../../notification/email.service.js';
import { CreateUserDomainDto } from '../domain/dto/create-user.domain.js';

@Injectable()
export class AuthService {
    constructor (
        @InjectModel(User.name)
        private UserModel: UserModelType,
        private usersRepository: UsersRepository,
        private emailService: EmailService 
    ) {}

    async registerUser (
        userInput: UserInputModel
    ) {
        const login = await this.usersRepository.findByLogin(userInput.login)

        if (login) {
            throw new BadRequestException([{ message: 'Login must be unique', field: 'login' }])
        }

        const email = await this.usersRepository.findByEmail(userInput.email)

        if (email) {
            throw new BadRequestException([{ message: 'Email must be unique', field: 'email' }])
        }

        const passwordHash = await bcrypt.hash(userInput.password, 10)

        const dtoForUserCreation = CreateUserDomainDto.mapToDomain(userInput, passwordHash)

        const user = this.UserModel.createInstance(dtoForUserCreation)

        await this.usersRepository.save(user)

        this.emailService
            .sendConfirmationEmail(user.email, user.emailConfirmationInfo.confirmationCode)
            .catch(console.error)
    }

    async emailConfirmation(
        code: string
    ): Promise<void> {
        const userByCode = await this.usersRepository.findUserByConfirmationCode(code)

        if (!userByCode) {
            throw new BadRequestException([{ message: 'Code should be correct and exist in the system', field: 'code' }])
        }

        userByCode.confirmEmail()

        await this.usersRepository.save(userByCode)
    }
}
