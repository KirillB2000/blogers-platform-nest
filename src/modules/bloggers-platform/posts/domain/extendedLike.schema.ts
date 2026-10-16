import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { LikeStatus } from "../../../../core/types/like-statuses.js";
import { LikeDetails, LikeDetailsSchema } from "./likeDetails.schema.js";


@Schema({
    _id: false
})
export class ExtendedLikesInfo {

    @Prop({
        type: Number,
        default: 0
    })
    likesCount: number

    @Prop({
        type: Number,
        default: 0
    })
    dislikesCount: number

    @Prop({
        type: String,
        enum: LikeStatus,
        default: LikeStatus.None
    })
    myStatus: LikeStatus

    @Prop({
        type: [LikeDetailsSchema],
        default: []
    })
    newestLikes: LikeDetails[]
}
export const ExtendedLikesInfoSchema = SchemaFactory.createForClass(ExtendedLikesInfo)