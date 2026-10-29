import { InjectModel } from "@nestjs/mongoose";
import { LikeStatusComment, LikeStatusCommentDocument, type LikeStatusCommentModelType } from "../domain/comment-like-status.entity.js";


export class CommentsLikeStatusRepository {
    constructor (
        @InjectModel(LikeStatusComment.name)
        private LikeStatusModel: LikeStatusCommentModelType
    ) {}


    async save (
        likeStatusDocument: LikeStatusCommentDocument
    ) {
        likeStatusDocument.save()
    }

    async findLikeStatusForSpecificComment (
        userId: string,
        commentId: string
    ): Promise<LikeStatusCommentDocument | null> {
        const likeStatusDoc = await this.LikeStatusModel.findOne(
            {userId, commentId}
        )

        return likeStatusDoc
    }

    async deleteLikeStatus(
        userId: string, 
        commentId: string
    ): Promise<void> {
        await this.LikeStatusModel.deleteOne(
            { userId, commentId }
        )
    }
}