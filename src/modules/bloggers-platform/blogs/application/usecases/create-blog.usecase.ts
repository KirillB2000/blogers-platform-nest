import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogAppDto } from "../dto/blogs.app-dto.js";
import { InjectModel } from "@nestjs/mongoose";
import { Blog, type BlogModelType } from "../../domain/blogs.entity.js";
import { BlogsRepository } from "../../infrastructure/blogs.repository.js";

export class CreateBlogCommand {
    constructor (
        public dto: BlogAppDto 
    ) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand, string> {
    constructor (
        @InjectModel(Blog.name)
        private BlogModel: BlogModelType,
        private blogsRepository: BlogsRepository
    ) {}

    async execute(
        command: CreateBlogCommand
    ): Promise<string> {
        const dto = command.dto

        const blog = this.BlogModel.createInstance({
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            isMembership: false
        })

        await this.blogsRepository.save(blog)

        return blog.id
    }
}