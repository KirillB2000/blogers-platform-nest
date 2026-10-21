import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserInputModel } from '../api/inputDto/uesrs.input-dto.js';
import { UsersRepository } from '../infrastructure/users.repository.js';
import bcrypt from 'bcrypt'
import { User, UserDocument, type UserModelType } from '../domain/user.entity.js';
import { InjectModel } from '@nestjs/mongoose';
import { EmailService } from '../../notification/email.service.js';
import { CreateUserDomainDto } from '../domain/dto/create-user.domain.js';
import { LoginInputModel } from '../api/inputDto/login.input-dto.js';
import { LoginSuccessViewModel } from '../api/viewDto/login-success.view-dto.js';
import { JwtService } from '@nestjs/jwt';
import { NewPasswordRecoveryInputModel } from '../api/inputDto/new-password-recovery.input-dto.js';

@Injectable()
export class AuthService {
    constructor (
    @InjectModel(User.name)
        private UserModel: UserModelType,
        private usersRepository: UsersRepository,
        private emailService: EmailService ,
        private jwtService: JwtService
    ) {}

    async validateUser(
        loginOrEmail: string,
        password: string
    ): Promise<UserDocument | null> {
        const user = await this.usersRepository.findByLoginOrEmailField(loginOrEmail)
        if (!user) return null

        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)
        if (!isPasswordCorrect) return null

        return user;
    }

    async login(
        userId: string
    ): Promise<LoginSuccessViewModel> {
        const payload = { sub: userId }
        const accessToken = this.jwtService.sign(payload)

        return { accessToken }
    }

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

        const passwordHash = await bcrypt.hash(userInput.password, 10) //TODO: make service

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
    
    async emailResending(
        email: string
    ): Promise<void> {
        const userByEmail = await this.usersRepository.findByEmail(email)

        if (!userByEmail) {
            throw new BadRequestException([{ message: 'Email should be in the system and should be correct', field: 'email' }])
        }

        userByEmail.updateConfirmationCode()

        await this.usersRepository.save(userByEmail)

        this.emailService
            .sendConfirmationEmail(userByEmail.emailConfirmationInfo.confirmationCode, userByEmail.email)
            .catch(console.error)
    }

    async passwordRecovery(
        email: string
    ): Promise<void> {
        const userByEmail = await this.usersRepository.findByEmail(email)

        if (!userByEmail) {
            return
        }

        const recoveryCode = userByEmail.updateRecoveryCode()

        await this.usersRepository.save(userByEmail)

        this.emailService
            .sendRecoveryPassword(recoveryCode, userByEmail.email)
            .catch(console.error)
    }

    async newPassword(
        passwordRecoveryCreds: NewPasswordRecoveryInputModel
    ):  Promise<void> {

        const newPassword = passwordRecoveryCreds.newPassword
        const recoveryCode = passwordRecoveryCreds.newPassword

        const userByRecoveryCode = await this.usersRepository.findUserByRecoveryCode(recoveryCode)

        if (!userByRecoveryCode) {
            throw new BadRequestException([{ message: 'Invalid recovery code', field: 'recoveryCode' }])
        }

        userByRecoveryCode.updatePasswordByRecoveryCode()
    }
}
