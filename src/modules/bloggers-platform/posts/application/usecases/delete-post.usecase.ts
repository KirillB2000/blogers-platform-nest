import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostsRepository } from "../../infrastructure/posts.repository.js";

export class DeletePostCommand {
    constructor (
        public id: string
    ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand, void> {
    constructor (
        private postsRepository: PostsRepository
    ) {}

    async execute(
        command: DeletePostCommand
    ): Promise<void> {
        const { id } = command

        await this.postsRepository.deleteByIdOrFail(id)
    }
}