import { IsEnum, IsNotEmpty } from "class-validator";
import { LikeStatus } from "../types/like-statuses.js";

export class LikeInputModel {

    @IsNotEmpty()
    @IsEnum(LikeStatus)
    likeStatus: LikeStatus.None
}