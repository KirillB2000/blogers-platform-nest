import { LikeStatus } from "../../../../../core/types/like-statuses.js"

export class LikesInfoViewDto {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
}