import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogAppDto } from "../dto/blogs.app-dto.js";
import { BlogsRepository } from "../../infrastructure/blogs.repository.js";

export class CreateBlogCommand {
    constructor (
        public dto: BlogAppDto 
    ) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand, number> {
    constructor (
        private blogsRepository: BlogsRepository
    ) {}

    async execute(
        command: CreateBlogCommand
    ): Promise<number> {
        const dto = command.dto

        const blogId = await this.blogsRepository.createBlog(dto.name, dto.description, dto.websiteUrl)

        return blogId
    }
}