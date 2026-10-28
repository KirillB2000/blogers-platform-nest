import { BadRequestException, Injectable } from '@nestjs/common';
import { UserInputModel } from '../api/inputDto/uesrs.input-dto.js';
import { UsersRepository } from '../infrastructure/users.repository.js';
import bcrypt from 'bcrypt'
import { User, UserDocument, type UserModelType } from '../domain/user.entity.js';
import { InjectModel } from '@nestjs/mongoose';
import { EmailService } from '../../notification/email.service.js';
import { CreateUserDomainDto } from '../domain/dto/create-user.domain.js';
import { LoginSuccessViewModel } from '../api/viewDto/login-success.view-dto.js';
import { JwtService } from '@nestjs/jwt';
import { NewPasswordRecoveryInputModel } from '../api/inputDto/new-password-recovery.input-dto.js';

@Injectable()
export class AuthService {
    constructor (
        @InjectModel(User.name)
        private UserModel: UserModelType,
        private usersRepository: UsersRepository,
        private emailService: EmailService,
    ) {}

    async newPassword(
        passwordRecoveryCreds: NewPasswordRecoveryInputModel
    ):  Promise<void> {

        const newPassword = passwordRecoveryCreds.newPassword
        const recoveryCode = passwordRecoveryCreds.recoveryCode

        const userByRecoveryCode = await this.usersRepository.findUserByRecoveryCode(recoveryCode)

        if (!userByRecoveryCode) {
            throw new BadRequestException([{ message: 'Invalid recovery code', field: 'recoveryCode' }])
        }

        userByRecoveryCode.checkRecoveryCodeOrThrow()

        const passwordHash = await bcrypt.hash(newPassword, 10)

        userByRecoveryCode.updatePassword(passwordHash)

        await this.usersRepository.save(userByRecoveryCode)
    }
}
