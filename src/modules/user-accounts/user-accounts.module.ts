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
import { PasswordService } from './application/adapters/password.service.js';
import { ValidateUserHanlder } from './application/queries/validate-user.query.js';
import { EmailConfirmationUseCase } from './application/usecases/email-conifrmation.usecase.js';
import { EmailResendingUseCase } from './application/usecases/email-resending.usecase.js';
import { LoginUserUseCase } from './application/usecases/login-user.usecase.js';
import { PasswordRecoveryUseCase } from './application/usecases/password-recovery.usecase.js';
import { RegisterUserUseCase } from './application/usecases/register-user.usecase.js';
import { UpdatePasswordUseCase } from './application/usecases/update-password.usecase.js';
import { UserConfig } from './config/user.config.js';
import { AuthConfig } from './config/auth.config.js';
import { SecurityDevicesRepository } from './infrastructure/sercurity-devices.repository.js';
import { SecurityDevices, SecurityDevicesSchema } from './domain/security-devices.entity.js';
import { JwtRefreshStrategy } from './guards/refresh/jwt-refresh.strategy.js';
import { DeleteUserUseCase } from './application/usecases/user/delete-user.usecase.js';
import { CreateUserUseCase } from './application/usecases/user/create-user.usecase.js';
import { LogoutUseCase } from './application/usecases/logout.usecase.js';
import { RefreshTokenUseCase } from './application/usecases/refresh-token.usecase.js';
import { SecurityDevicesController } from './api/security-devices.controller.js';
import { SecurityDevicesQueryRepository } from './infrastructure/sercurity-devices.query-repository.js';
import { DeleteSpecificSessionUseCase } from './application/usecases/securityDevices/delete-specific-session.usercase.js';
import { DeleteAllExceptActiveUseCase } from './application/usecases/securityDevices/delete-all-except-active.usecase.js';

const userAuthUseCases = [
  CreateUserUseCase,
  DeleteUserUseCase,
  EmailConfirmationUseCase,
  EmailResendingUseCase,
  LoginUserUseCase,
  PasswordRecoveryUseCase,
  RegisterUserUseCase,
  UpdatePasswordUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  DeleteSpecificSessionUseCase,
  DeleteAllExceptActiveUseCase
]

const userAuthQueries = [
  ValidateUserHanlder
]

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {name: SecurityDevices.name, schema: SecurityDevicesSchema}
    ]),

    JwtModule.registerAsync({
      useFactory: (authConfig: AuthConfig) => {
        return {
          secret: authConfig.jwtAccessSecret,
          signOptions: { expiresIn: '5m' }
        }
      },
      inject: [AuthConfig]
    }),
    NotificationModule
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    UsersRepository, 
    UsersQwRepo,
    AuthQueryRepository,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    EmailExamples,
    PasswordService,
    SecurityDevicesRepository,
    SecurityDevicesQueryRepository,

    UserConfig,

    ...userAuthUseCases,
    ...userAuthQueries
  ],
  exports: [UsersRepository]
})
export class UserAccountsModule {}