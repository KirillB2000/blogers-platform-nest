import { Prop, Schema } from "@nestjs/mongoose";

// TODO: split LikesInfo on two collections (for separate LikeStatus from specific comment)

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}

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
        type: LikeStatus,
        default: LikeStatus.None
    })
    myStatus: LikeStatus
}