import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { LikeStatus } from "../../../../core/types/like-statuses.js";
import { HydratedDocument, Model } from "mongoose";
import { CreatePostsLikeStatusDomain } from "./dto/create-pots-like-status.domain-dto.js";


@Schema({
    timestamps: {
        createdAt: 'addedAt'
    }
})
export class LikeStatusPosts {
    
    @Prop({
        required: true,
        type: String
    })
    userId: string

    @Prop({
        required: true,
        type: String
    })
    login: string
    
    @Prop({
        required: true,
        type: String
    })
    postId: string

    @Prop({
        type: String,
        enum: LikeStatus,
        default: LikeStatus.None
    })
    myStatus: LikeStatus

    addedAt: Date
    updatedAt: Date

    static createInstance (
        dto: CreatePostsLikeStatusDomain
    ): LikeStatusPostsDocument {
        const likeStatusPosts = new this()

        likeStatusPosts.userId = dto.userId
        likeStatusPosts.postId = dto.postId
        likeStatusPosts.login = dto.login
        likeStatusPosts.myStatus = dto.myStatus

        return likeStatusPosts as LikeStatusPostsDocument
    }
}

export const LikeStatusPostsSchema = SchemaFactory.createForClass(LikeStatusPosts)

LikeStatusPostsSchema.index({ userId: 1, postId: 1 })

LikeStatusPostsSchema.loadClass(LikeStatusPosts)

export type LikeStatusPostsDocument = HydratedDocument<LikeStatusPosts>

export type LikeStatusPostsModelType = Model<LikeStatusPostsDocument> & typeof LikeStatusPosts