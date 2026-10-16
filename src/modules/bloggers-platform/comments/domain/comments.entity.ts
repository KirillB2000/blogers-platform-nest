import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CommentatorInfo, CommentatorInfoSchema } from "./commentator-info.schema.js";
import { LikesInfo, LikesInfoSchema } from "./likes-info.schema.js";
import { HydratedDocument, Model } from "mongoose";


@Schema({timestamps: true})
export class Comment {
    @Prop({
        required: true,
        type: String
    })
    postId: string

    @Prop({
        required: true,
        type: String
    })
    content: string

    @Prop({
        required: true,
        type: CommentatorInfoSchema
    })
    commentatorInfo: CommentatorInfo

    @Prop({
        type: LikesInfoSchema
    })
    likesInfo: LikesInfo

    createdAt: Date
    updatedAt: Date

    // TODO: add static method to create instance of Comment class
}

export const CommentsSchema = SchemaFactory.createForClass(Comment)

CommentsSchema.loadClass(Comment)

export type CommentDocument = HydratedDocument<Comment>

export type CommentModelType = Model<CommentDocument> & typeof Comment