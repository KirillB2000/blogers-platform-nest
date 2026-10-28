import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../infrastructure/users.repository.js";

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

        await this.usersRepository.delete(id)
    }

}