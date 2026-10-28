import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, type UserModelType } from '../domain/user.entity.js';
import { UsersRepository } from '../infrastructure/users.repository.js';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private UserModel: UserModelType,
        private usersRepository: UsersRepository,
    ) {}
}
