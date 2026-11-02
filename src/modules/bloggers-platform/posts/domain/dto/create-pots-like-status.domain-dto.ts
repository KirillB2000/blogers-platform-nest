import { LikeStatus } from "../../../../../core/types/like-statuses.js"

export class CreatePostsLikeStatusDomain {
    userId: string
    login: string
    postId: string
    myStatus: LikeStatus
}