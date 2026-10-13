import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, type UserModelType } from '../domain/user.entity.js';
import { UsersRepository } from '../infrastructure/users.repository.js';
import bcrypt from 'bcrypt'
import { CreateUserDto } from '../dto/create-user.dto.js';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private UserModel: UserModelType,
        private usersRepository: UsersRepository,
    ) {}

    async createUser(
        dto: CreateUserDto
    ): Promise<string> {

        // TODO: move to bycrypt service

        const passwordHash = await bcrypt.hash(dto.password, 10)

        const user = this.UserModel.createInstance({
            email: dto.email,
            login: dto.login,
            passwordHash: passwordHash,
        })

        await this.usersRepository.save(user)

        return user._id.toString()
    }

    async deleteUser(
        id: string
    ) {
        await this.usersRepository.findOrNotFoundFail(id);

        await this.usersRepository.delete(id)
    }
}
