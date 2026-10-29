import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { LikeStatus } from "../../../../core/types/like-statuses.js";
import { HydratedDocument, Model } from "mongoose";


@Schema()
export class LikeStatusComment {
    @Prop({
        required: true,
        type: String
    })
    commentId: string

    @Prop({
        required: true,
        type: String
    })
    userId: string

    @Prop({
        type: String,
        enum: LikeStatus,
        default: LikeStatus.None
    })
    myStatus: LikeStatus

    static createInstance (
        userId: string,
        commentId: string,
        myStatus: LikeStatus
    ) {
        const likeStatusComment = new this()

        likeStatusComment.commentId = commentId
        likeStatusComment.userId = userId
        likeStatusComment.myStatus = myStatus

        return likeStatusComment as LikeStatusCommentDocument
    }
}

export const LikeStatusCommentSchema = SchemaFactory.createForClass(LikeStatusComment)

LikeStatusCommentSchema.loadClass(LikeStatusComment)

export type LikeStatusCommentDocument = HydratedDocument<LikeStatusComment>

export type LikeStatusCommentModelType = Model<LikeStatusCommentDocument> & typeof LikeStatusComment