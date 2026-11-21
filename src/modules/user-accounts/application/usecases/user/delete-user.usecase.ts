import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../../../infrastructure/users.repository.js";

export class DeleteUserCommand {
    constructor ( public id: number ) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand, void> {
    constructor (
        private usersRepository: UsersRepository
    ) {}

    async execute(
        command: DeleteUserCommand
    ): Promise<void> {
        const { id } = command

        const isDeleted = await this.usersRepository.deleteById(id)

        if (!isDeleted) {
            throw new NotFoundException('User not found')
        }
    }
}