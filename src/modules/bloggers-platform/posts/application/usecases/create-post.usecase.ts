import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostAppDto } from "../dto/post.app-dto.js";
import { BlogsRepository } from "../../../blogs/infrastructure/blogs.repository.js";
import { PostsRepository } from "../../infrastructure/posts.repository.js";
import { NotFoundException } from "@nestjs/common";

export class CreatePostCommand {
    constructor (
        public dto: PostAppDto
    ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand, number> {
    constructor (
        private blogsRepository: BlogsRepository,
        private postsRepository: PostsRepository
    ) {}

    async execute(
        command: CreatePostCommand
    ): Promise<number> {
        const dto = command.dto

        const blog = await this.blogsRepository.findById(dto.blogId)
        
        if (!blog) {
            throw new NotFoundException('Blog not found')
        }


        const postId = await this.postsRepository.createPost(
            dto.title,
            dto.shortDescription,
            dto.content,
            dto.blogId
        )

        return postId
    }
}