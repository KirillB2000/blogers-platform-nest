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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationModule
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService, 
    AuthService, 
    UsersRepository, 
    UsersQwRepo],
  exports: [UsersService, UsersRepository]
})
export class UserAccountsModule {}
