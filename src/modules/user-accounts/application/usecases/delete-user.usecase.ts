import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../infrastructure/users.repository.js";
import { NotFoundException } from "@nestjs/common";

export class DeleteUserCommand {
    constructor ( public id: string ) {}
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
        await this.usersRepository.findOrNotFoundFail(id);

        const isDeleted = await this.usersRepository.deleteById(id)

        if (!isDeleted) {
            throw new NotFoundException('User not found')
        }
    }

}