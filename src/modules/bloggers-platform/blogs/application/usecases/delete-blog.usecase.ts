import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../../infrastructure/blogs.repository.js";

export class DeleteBlogCommand {
    constructor (
        public id: string
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

        await this.blogsRepository.deleteBlogByIdOrFail(id)
    }
}