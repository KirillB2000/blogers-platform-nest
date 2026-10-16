import { LikeStatus } from "../../../../../core/types/like-statuses.js"
import { LikeDetailsViewModel } from "./likeDetails.view-dto.js"

export class ExtendedLikesInfoViewModel {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
    newestLikes: LikeDetailsViewModel[] | null
}