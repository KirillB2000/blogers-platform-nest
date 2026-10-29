import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LikeStatus } from "../../../../core/types/like-statuses.js";
import { CommentsRepositroy } from "../infrastructure/comments.repository.js";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsersRepository } from "../../../user-accounts/infrastructure/users.repository.js";
import { CommentsLikeStatusRepository } from "../infrastructure/comments-like-status.repository.js";
import { InjectModel } from "@nestjs/mongoose";
import { LikeStatusComment, type LikeStatusCommentModelType } from "../domain/comment-like-status.entity.js";

export class UpdateCommentLikeStatusCommand {
    constructor (
        public userId: string,
        public commentId: string,
        public likeStatus: LikeStatus
    ) {}
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusUseCase implements ICommandHandler<UpdateCommentLikeStatusCommand, void> {
    constructor (
        @InjectModel(LikeStatusComment.name)
        private LikeStatusCommentModel: LikeStatusCommentModelType,
        private commentsRepository: CommentsRepositroy,
        private commentsLikeStatusRepository: CommentsLikeStatusRepository
    ) {}

    async execute(
        command: UpdateCommentLikeStatusCommand
    ): Promise<void> {
        const { userId, commentId, likeStatus: newStatus, } = command

        const comment = await this.commentsRepository.findById(commentId)

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        let likeStatusDocument = await this.commentsLikeStatusRepository.findLikeStatusForSpecificComment(userId, commentId)
        const oldStatus = likeStatusDocument ? likeStatusDocument.myStatus : LikeStatus.None

        if (newStatus == oldStatus) return

        if (newStatus === LikeStatus.None) {
            await this.commentsLikeStatusRepository.deleteLikeStatus(userId, commentId)
        } else {
            if (!likeStatusDocument) {
                likeStatusDocument = this.LikeStatusCommentModel.createInstance(userId, commentId, newStatus)
            }
            likeStatusDocument.myStatus = newStatus
            await this.commentsLikeStatusRepository.save(likeStatusDocument)
        }

        comment.updateLikeCounters(oldStatus, newStatus)
        
        await this.commentsRepository.save(comment)
    }
}