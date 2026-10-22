import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository.js";
import { MeViewDto } from "../api/viewDto/me.view-dto.js";


@Injectable()
export class AuthQueryRepository {
    constructor (
        private usersRepository: UsersRepository
    ) {}

    async me (
        userId: string
    ): Promise<MeViewDto> {
        const userDoc = await this.usersRepository.findOrNotFoundFail(userId)

        return MeViewDto.mapToView(userDoc)
    }
}