import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { LikeStatus } from "../../../../core/types/like-statuses.js";

// TODO: split LikesInfo on two collections (for separate LikeStatus from specific comment)

@Schema({
    _id: false
})
export class LikesInfo {
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
}

export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo)