import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ExtendedLikesInfo, ExtendedLikesInfoSchema } from "./extendedLike.schema.js";
import { CreatePostDomainDto } from "./dto/create-post.domain-dto.js";
import { LikeStatus } from "../../../../core/types/like-statuses.js";
import { HydratedDocument, Model } from "mongoose";
import { UpdatePostDomainDto } from "./dto/update-post.domain-dto.js";

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

    static createInstance(
        dto: CreatePostDomainDto
    ): PostDocument { 
        const post = new this()

        post.title = dto.title
        post.shortDescription = dto.shortDescription
        post.content = dto.content
        post.blogId = dto.blogId
        post.blogName = dto.blogName

        post.extendedLikesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: LikeStatus.None,
            newestLikes: []
        }

        return post as PostDocument
    }

    update (dto: UpdatePostDomainDto) {
        this.title = dto.title
        this.shortDescription = dto.shortDescription
        this.content = dto.content
        this.blogId = dto.blogId
        this.blogName = dto.blogName
    }
}

export const PostSchema = SchemaFactory.createForClass(Post)

PostSchema.loadClass(Post)

export type PostDocument = HydratedDocument<Post>

export type PostModelType = Model<PostDocument> & typeof Post