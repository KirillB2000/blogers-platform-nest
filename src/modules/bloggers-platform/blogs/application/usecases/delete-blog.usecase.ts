import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../../infrastructure/blogs.repository.js";
import { NotFoundException } from "@nestjs/common";

export class DeleteBlogCommand {
    constructor (
        public id: number
    ) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand, void> {
    constructor (
        private blogsRepository: BlogsRepository
    ) {}

    async execute(
        command: DeleteBlogCommand
    ): Promise<void> {
        const { id } = command

        const isDeleted = await this.blogsRepository.deleteBlogById(id)

        if (!isDeleted) {
            throw new NotFoundException('Blog not found')
        }
    }
}