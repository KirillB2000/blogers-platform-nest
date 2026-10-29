import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { UsersRepository } from "../../../user-accounts/infrastructure/users.repository.js"
import { CommentsRepositroy } from "../infrastructure/comments.repository.js"
import { NotFoundException, UnauthorizedException } from "@nestjs/common"

export class DeleteCommentCommand {

    constructor (
        public userId: string,
        public commentId: string
    ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand, void> {
    constructor (
        private usersRepository: UsersRepository,
        private commentsRepository: CommentsRepositroy
    ) {}

    async execute(
        command: DeleteCommentCommand
    ): Promise<void> {
        const userId = command.userId
        const commentId = command.commentId

        const isUserExist = await this.usersRepository.countUsersById(userId)

        if (!isUserExist) {
            throw new UnauthorizedException('Unauthorized')
        }

        const comment = await this.commentsRepository.findById(commentId)

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        comment.checkDeletionAccess(userId)

        await this.commentsRepository.deleteCommentById(commentId)
    }
}