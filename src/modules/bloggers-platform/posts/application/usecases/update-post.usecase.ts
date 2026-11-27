import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostsRepository } from "../../infrastructure/posts.repository.js";
import { BlogsRepository } from "../../../blogs/infrastructure/blogs.repository.js";
import { NotFoundException } from "@nestjs/common";
import { BlogPostInputModel } from "../../../blogs/api/inputDto/blog-post.input-dto.js";

export class UpdatePostCommand {
    constructor (
        public blogId: number,
        public postId: number,
        public dto: BlogPostInputModel
    ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand, void> {
    constructor (
        private postsRepository: PostsRepository,
        private blogsRepository: BlogsRepository
    ) {}

    async execute(
        command: UpdatePostCommand
    ): Promise<void> {
        const { blogId, postId, dto } = command

        const isPostExist = await this.postsRepository.postExistence(postId)

        if (!isPostExist) {
            throw new NotFoundException('Post not found')
        }

        const isBlogExist = await this.blogsRepository.checkBlogExists(blogId)
        
        if (!isBlogExist) {
            throw new NotFoundException('Blog not found')
        }

        const isUpdated = await this.postsRepository.updatePostForSpecificBlog(
            blogId,
            dto.title, 
            dto.shortDescription, 
            dto.content,
            postId
        )

        if (!isUpdated) {
            throw new NotFoundException('Blog or post not found')
        }
    }
}