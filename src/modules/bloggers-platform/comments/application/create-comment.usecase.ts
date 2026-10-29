import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../../user-accounts/infrastructure/users.repository.js";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PostsRepository } from "../../posts/infrastructure/posts.repository.js";
import { InjectModel } from "@nestjs/mongoose";
import { Comment, type CommentModelType } from "../domain/comments.entity.js";
import { CommentsRepositroy } from "../infrastructure/comments.repository.js";

export class CreateCommentCommand {
    constructor (
        public userId: string,
        public postId: string,
        public content: string
    ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand, string> {
    constructor (
        @InjectModel(Comment.name)
        private CommentModel: CommentModelType,
        private usersRepository: UsersRepository,
        private postsRepository: PostsRepository,
        private commentsRepository: CommentsRepositroy
    ) {}

    async execute(
        command: CreateCommentCommand
    ): Promise<string> {
        const { userId, postId, content } = command

        const user = await this.usersRepository.findById(userId)
        if (!user) {
            throw new UnauthorizedException('Unauthorized')
        }

        const userLogin = user.login

        const post = await this.postsRepository.findById(postId)
        if (!post) {
            throw new NotFoundException('Post not found')
        }

        const comment = this.CommentModel.createInstance ({
            content,
            postId,
            userId,
            userLogin
        })

        await this.commentsRepository.save(comment)

        return comment.id
    }
}