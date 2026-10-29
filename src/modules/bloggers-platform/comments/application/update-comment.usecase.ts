import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../../user-accounts/infrastructure/users.repository.js";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CommentsRepositroy } from "../infrastructure/comments.repository.js";

export class UpdateCommentCommand {
    constructor (
        public userId: string,
        public commentId: string,
        public content: string
    ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand, void>{
    constructor (
        private usersRepository: UsersRepository,
        private commentsRepository: CommentsRepositroy
    ) {}

    async execute(
        command: UpdateCommentCommand
    ): Promise<void> {
        const { userId, commentId, content: content } = command

        const comment = await this.commentsRepository.findById(commentId)
        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        comment.updateContentWithCkeck(userId, content)

        await this.commentsRepository.save(comment)

    }
}