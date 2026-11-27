import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostsRepository } from "../../infrastructure/posts.repository.js";
import { NotFoundException } from "@nestjs/common";

export class DeletePostCommand {
    constructor (
        public blogId: number,
        public postId: number
    ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand, void> {
    constructor (
        private postsRepository: PostsRepository,
    ) {}

    async execute(
        command: DeletePostCommand
    ): Promise<void> {
        const { blogId, postId } = command

        const isDeleted = await this.postsRepository.deleteById(blogId, postId)

        if (!isDeleted) {
            throw new NotFoundException('Post or blog not found')
        }
    }
}