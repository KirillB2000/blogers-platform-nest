import { LikeStatus } from "../../../../../core/types/like-statuses.js"
import { CommentDocument } from "../../domain/comments.entity.js"
import { CommentatorInfoViewDto } from "./commentator-info.view-dto.js"
import { LikesInfoViewDto } from "./likes-info-comment.view-dto.js"

export class CommentViewModel {
    id: string
    content: string
    commentatorInfo: CommentatorInfoViewDto
    createdAt: Date
    likesInfo: LikesInfoViewDto

    static mapToView(
        comment: CommentDocument,
        myStatus: LikeStatus
    ): CommentViewModel {
        const dto = new CommentViewModel()

        dto.id = comment._id.toString()
        dto.content = comment.content
        dto.commentatorInfo = comment.commentatorInfo
        dto.createdAt = comment.createdAt
        dto.likesInfo = {...comment.likesInfo, myStatus}

        return dto
    }
}