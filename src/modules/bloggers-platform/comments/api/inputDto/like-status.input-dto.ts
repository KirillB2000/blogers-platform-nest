import { IsEnum } from "class-validator";
import { LikeStatus } from "../../../../../core/types/like-statuses.js";

export class LikeInputModel {

    @IsEnum(LikeStatus)
    likeStatus: LikeStatus.None
}