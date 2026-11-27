import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ExtendedLikesInfo, ExtendedLikesInfoSchema } from "./extendedLike.schema.js";
import { CreatePostDomainDto } from "./dto/create-post.domain-dto.js";
import { LikeStatus } from "../../../../core/types/like-statuses.js";
import { HydratedDocument, Model } from "mongoose";
import { UpdatePostDomainDto } from "./dto/update-post.domain-dto.js";

export const postRestrictions = {
    titleMaxLength: 30,
    shortDescriptionMaxLength: 100,
    contentMaxLength: 1000
}

@Schema({timestamps: true})
export class Post {

    @Prop({
        required: true,
        type: String
    })
    title: string

    @Prop({
        required: true,
        type: String
    })
    shortDescription: string

    @Prop({
        required: true,
        type: String
    })
    content: string

    @Prop({
        required: true,
        type: String
    })
    blogId: string

    @Prop({
        required: true,
        type: String
    })
    blogName: string

    @Prop({
        type: ExtendedLikesInfoSchema
    })
    extendedLikesInfo: ExtendedLikesInfo

    createdAt: Date
    updatedAt: Date

    updateLikeCounters (
        oldStatus: LikeStatus,
        newStatus: LikeStatus
    ) {
        if (oldStatus === newStatus) return

        let likes = this.extendedLikesInfo.likesCount
        let dislikes = this.extendedLikesInfo.dislikesCount

        if (oldStatus === LikeStatus.Like) likes--
        if (oldStatus === LikeStatus.Dislike) dislikes--

        if (newStatus === LikeStatus.Like) likes++
        if (newStatus === LikeStatus.Dislike) dislikes++

        this.extendedLikesInfo = {
            ...this.extendedLikesInfo,
            likesCount: likes,
            dislikesCount: dislikes
        }
    }
}

export const PostSchema = SchemaFactory.createForClass(Post)

PostSchema.loadClass(Post)

export type PostDocument = HydratedDocument<Post>

export type PostModelType = Model<PostDocument> & typeof Post