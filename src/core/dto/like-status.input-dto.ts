import { IsEnum } from "class-validator";
import { LikeStatus } from "../types/like-statuses.js";

export class LikeInputModel {

    @IsEnum(LikeStatus)
    likeStatus: LikeStatus.None
}