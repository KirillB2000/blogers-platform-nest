import { CommentatorInfo } from "../../domain/commentator-info.schema.js"
import { CommentDocument } from "../../domain/comments.entity.js"
import { LikesInfo } from "../../domain/likes-info.schema.js"

export class CommentViewModel {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: Date
    likesInfo: LikesInfo

    static mapToView(
        comment: CommentDocument
    ): CommentViewModel {
        const dto = new CommentViewModel()

        dto.id = comment._id.toString()
        dto.content = comment.content
        dto.commentatorInfo = comment.commentatorInfo
        dto.createdAt = comment.createdAt
        dto.likesInfo = comment.likesInfo

        return dto
    }
}