import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostAppDto } from "../dto/post.app-dto.js";
import { PostsRepository } from "../../infrastructure/posts.repository.js";
import { BlogsRepository } from "../../../blogs/infrastructure/blogs.repository.js";
import { NotFoundException } from "@nestjs/common";

export class UpdatePostCommand {
    constructor (
        public id: string,
        public dto: PostAppDto
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
        const { id, dto } = command

        const postDoc = await this.postsRepository.findById(id)

        if (!postDoc) {
            throw new NotFoundException('Post not found')
        }

        const blog = await this.blogsRepository.findByIdOrFail(dto.blogId)
        const blogName = blog.name

        postDoc.update({
            ...dto,
            blogName
        })

        await this.postsRepository.save(postDoc)
    }
}