import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { LikeStatus } from "../../../../core/types/like-statuses.js";


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
}
export const ExtendedLikesInfoSchema = SchemaFactory.createForClass(ExtendedLikesInfo)