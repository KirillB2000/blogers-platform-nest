import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity.js';
import { UsersRepository } from './infrastructure/users.repository.js';
import { UsersQwRepo } from './infrastructure/users.query-repository.js';
import { AuthController } from './api/auth.controller.js';
import { NotificationModule } from '../notification/notification.module.js';
import { JwtModule } from '@nestjs/jwt'
import { LocalStrategy } from './guards/local/local.strategy.js';
import { EmailExamples } from '../notification/email.examples.js';
import { JwtStrategy } from './guards/bearer/jwt.strategy.js';
import { AuthQueryRepository } from './infrastructure/auth.query-repository.js';
import { CreateUserUseCase } from './application/usecases/create-user.usecase.js';
import { PasswordService } from './application/adapters/password.service.js';
import { DeleteUserUseCase } from './application/usecases/delete-user.usecase.js';
import { ValidateUserHanlder } from './application/queries/validate-user.query.js';
import { EmailConfirmationUseCase } from './application/usecases/email-conifrmation.usecase.js';
import { EmailResendingUseCase } from './application/usecases/email-resending.usecase.js';
import { LoginUserUseCase } from './application/usecases/login-user.usecase.js';
import { PasswordRecoveryUseCase } from './application/usecases/password-recovery.usecase.js';
import { RegisterUserUseCase } from './application/usecases/register-user.usecase.js';
import { UpdatePasswordUseCase } from './application/usecases/update-password.usecase.js';

const userAuthUseCases = [
  CreateUserUseCase,
  DeleteUserUseCase,
  EmailConfirmationUseCase,
  EmailResendingUseCase,
  LoginUserUseCase,
  PasswordRecoveryUseCase,
  RegisterUserUseCase,
  UpdatePasswordUseCase
]

const userAuthQueries = [
  ValidateUserHanlder
]

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: {expiresIn: '5m'}
    }),
    NotificationModule
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersRepository, 
    UsersQwRepo,
    AuthQueryRepository,
    LocalStrategy,
    JwtStrategy,
    EmailExamples,
    PasswordService,

    ...userAuthUseCases,
    ...userAuthQueries
  ],
  exports: [UsersRepository]
})
export class UserAccountsModule {}
