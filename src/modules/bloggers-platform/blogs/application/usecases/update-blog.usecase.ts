import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogAppDto } from "../dto/blogs.app-dto.js";
import { BlogsRepository } from "../../infrastructure/blogs.repository.js";
import { NotFoundException } from "@nestjs/common";

export class UpdateBlogCommand {
    constructor (
        public id: number,
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

        const isUpdated = await this.blogsRepository.updateById(
            id, 
            dtoWithUpdateData.name, 
            dtoWithUpdateData.description, 
            dtoWithUpdateData.websiteUrl
        )

        if (!isUpdated) {
            throw new NotFoundException('Blog not found')
        }
    }
}