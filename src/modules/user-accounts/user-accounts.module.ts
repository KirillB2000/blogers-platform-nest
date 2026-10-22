import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller.js';
import { UsersService } from './application/users.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity.js';
import { UsersRepository } from './infrastructure/users.repository.js';
import { UsersQwRepo } from './infrastructure/users.query-repository.js';
import { AuthController } from './api/auth.controller.js';
import { AuthService } from './application/auth.service.js';
import { NotificationModule } from '../notification/notification.module.js';
import { JwtModule } from '@nestjs/jwt'
import { LocalStrategy } from './guards/local/local.strategy.js';
import { EmailExamples } from '../notification/email.examples.js';
import { JwtStrategy } from './guards/bearer/jwt.strategy.js';

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
    UsersService, 
    AuthService, 
    UsersRepository, 
    UsersQwRepo,
    LocalStrategy,
    JwtStrategy,
    EmailExamples
  ],
  exports: [UsersService, UsersRepository]
})
export class UserAccountsModule {}
