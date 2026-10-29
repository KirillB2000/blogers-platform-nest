import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CommentatorInfo, CommentatorInfoSchema } from "./commentator-info.schema.js";
import { LikesInfo, LikesInfoSchema } from "./likes-info.schema.js";
import { HydratedDocument, Model } from "mongoose";
import { CreateCommentDomainDto } from "./dto/create-comment.domain-dto.js";
import { ForbiddenException } from "@nestjs/common";

export const contentConstraints = {
    minLength: 20,
    maxLength: 300
}

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

    static createInstance (
        domainDto: CreateCommentDomainDto
    ) {
        const comment = new Comment()

        comment.content = domainDto.content
        comment.postId = domainDto.postId
        
        comment.commentatorInfo = {
            userId: domainDto.userId,
            userLogin: domainDto.userLogin
        }

        return comment as CommentDocument
    }

    checkDeletionAccess(
        userId: string
    ) {
        if (this.commentatorInfo.userId !== userId) {
            throw new ForbiddenException('Forbidden')
        }
    }

    updateContentWithCkeck(
        userId: string,
        content: string
    ) {
        if (this.commentatorInfo.userId !== userId) {
            throw new ForbiddenException('Forbidden')
        }

        this.content = content
    }
}

export const CommentsSchema = SchemaFactory.createForClass(Comment)

CommentsSchema.loadClass(Comment)

export type CommentDocument = HydratedDocument<Comment>

export type CommentModelType = Model<CommentDocument> & typeof Comment