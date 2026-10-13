import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CommentatorInfo } from "./commentator-info.schema.js";
import { LikesInfo } from "./likes-info.schema.js";
import { HydratedDocument, Model } from "mongoose";


@Schema({timestamps: true})
export class Comment {
    @Prop({
        required: true,
        type: String
    })
    content: string

    @Prop({
        required: true,
        type: CommentatorInfo
    })
    commentatorInfo: CommentatorInfo

    @Prop({
        type: LikesInfo
    })
    likesInfo: LikesInfo

    createdAt: Date
    updateAt: Date

    // TODO: add static method to create instance of Comment class
}

export const CommentsSchema = SchemaFactory.createForClass(Comment)

CommentsSchema.loadClass(Comment)

export type CommentDocument = HydratedDocument<Comment>

export type CommentModelType = Model<CommentDocument> & typeof Comment