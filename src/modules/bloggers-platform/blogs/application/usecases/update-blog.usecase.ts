import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogAppDto } from "../dto/blogs.app-dto.js";
import { BlogsRepository } from "../../infrastructure/blogs.repository.js";

export class UpdateBlogCommand {
    constructor (
        public id: string,
        public dtoWithUpdateData: BlogAppDto
    ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand, void> {
    constructor (
        private blogsRepository: BlogsRepository
    ) {}

    async execute(
        command: UpdateBlogCommand
    ): Promise<void> {
        const { id, dtoWithUpdateData } = command

        const blogDoc = await this.blogsRepository.findByIdOrFail(id)

        blogDoc.update(dtoWithUpdateData)

        await this.blogsRepository.save(blogDoc)
    }
}