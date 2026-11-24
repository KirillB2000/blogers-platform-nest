import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository.js";
import { MeViewDto } from "../api/viewDto/me.view-dto.js";
import { DataSource } from 'typeorm'
import { InjectDataSource } from "@nestjs/typeorm";


@Injectable()
export class AuthQueryRepository {
    constructor (
        @InjectDataSource()
        protected dataSource: DataSource,

        private usersRepository: UsersRepository,
    ) {}

    async me (
        userId: number
    ): Promise<MeViewDto> {
        const userDbRow = await this.usersRepository.findOrNotFoundFail(userId)

        return MeViewDto.mapToView(userDbRow)
    }
}