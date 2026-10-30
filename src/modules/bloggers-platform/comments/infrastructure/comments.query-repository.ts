import { Injectable, NotFoundException } from "@nestjs/common";
import { CommentViewModel } from "../api/viewDto/comments.view-dto.js";
import { Comment, type CommentModelType } from "../domain/comments.entity.js";
import { InjectModel } from "@nestjs/mongoose";
import { GetCommentQueryParams } from "../api/inputDto/get-comments-qury-params.input-dto.js";
import { CommentsPaginatedViewDto } from "../api/viewDto/comments.paginated.view-dto.js";
import { LikeStatusComment, type LikeStatusCommentModelType } from "../domain/comment-like-status.entity.js";
import { LikeStatus } from "../../../../core/types/like-statuses.js";

@Injectable()
export class CommentsQwRepo {
    
    constructor(
        @InjectModel(Comment.name)
        private CommentModel: CommentModelType,
        @InjectModel(LikeStatusComment.name)
        private LikeStatusCommentModel: LikeStatusCommentModelType
    ) {}

    async getCommentByIdOrFail(
        commentId: string,
        userId?: string | null
    ): Promise<CommentViewModel> {

        const commentDoc = await this.CommentModel.findById(commentId).lean().exec()

        if (!commentDoc) {
            throw new NotFoundException('Comment not found')
        }

        let likeStatus = LikeStatus.None
        if (userId) {
            const likeStatusDb = await this.LikeStatusCommentModel.findOne(
                { userId: userId, commentId: commentId }
            )

            if (likeStatusDb) likeStatus = likeStatusDb.myStatus
        }

        const commentViewModel = CommentViewModel.mapToView(commentDoc, likeStatus)

        return commentViewModel
    }

    async getAll (
        postId: string,
        query: GetCommentQueryParams,
        userId?: string | null
    ): Promise <CommentsPaginatedViewDto> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        } = query

        const filter: any = {postId: postId}
        const skip = query.calculateSkip()

        const result = await this.CommentModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .lean()
            .exec()

        let likesMap: Record<string, LikeStatus> = {}
        const commentsIds = result.map(comm => comm.id)

        if (userId) {
            const likeStatusesDocuments = await this.LikeStatusCommentModel
                .find({userId: userId, commentId: {$in: commentsIds}})

            likeStatusesDocuments.forEach( doc => {
                likesMap[doc.commentId] = doc.myStatus
            })
        }

        const items = result.map(comment => {
            const likeStatus = likesMap[comment.id] || LikeStatus.None

            return CommentViewModel.mapToView(comment, likeStatus)
        })
        const totalCount = await this.CommentModel.countDocuments(filter)

        return CommentsPaginatedViewDto.mapToView({
            items,
            totalCount,
            page: pageNumber,
            size: pageSize
        })
    }
}
