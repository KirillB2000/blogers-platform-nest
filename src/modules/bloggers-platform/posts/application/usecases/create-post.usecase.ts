import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostAppDto } from "../dto/post.app-dto.js";
import { BlogsRepository } from "../../../blogs/infrastructure/blogs.repository.js";
import { PostsRepository } from "../../infrastructure/posts.repository.js";
import { InjectModel } from "@nestjs/mongoose";
import { Post, type PostModelType } from "../../domain/posts.entity.js";

export class CreatePostCommand {
    constructor (
        public dto: PostAppDto
    ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand, string> {
    constructor (
        @InjectModel(Post.name)
        private PostModel: PostModelType,
        private blogsRepository: BlogsRepository,
        private postsRepository: PostsRepository
    ) {}

    async execute(
        command: CreatePostCommand
    ): Promise<string> {
        const dto = command.dto

        const blog = await this.blogsRepository.findByIdOrFail(dto.blogId)
        const blogName = blog.name


        const postDoc = this.PostModel.createInstance({
            ...dto,
            blogName: blogName
        })

        await this.postsRepository.save(postDoc)

        return postDoc.id
    }
}