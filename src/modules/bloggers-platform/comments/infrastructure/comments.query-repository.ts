import { Injectable, NotFoundException } from "@nestjs/common";
import { CommentViewModel } from "../api/viewDto/comments.view-dto.js";
import { Comment, type CommentModelType } from "../domain/comments.entity.js";
import { InjectModel } from "@nestjs/mongoose";
import { GetCommentQueryParams } from "../api/inputDto/get-comments-qury-params.input-dto.js";
import { CommentsPaginatedViewDto } from "../api/viewDto/comments.paginated.view-dto.js";

@Injectable()
export class CommentsQwRepo {
    
    constructor(
        @InjectModel(Comment.name)
        private CommentModel: CommentModelType
    ) {}

    async getCommentByIdOrFail(
        id: string
    ): Promise<CommentViewModel> {
        const commentDoc = await this.CommentModel.findById(id).exec()

        if (!commentDoc) {
            throw new NotFoundException('Comment not found')
        }

        const commentViewModel = CommentViewModel.mapToView(commentDoc)

        return commentViewModel
    }

    async getAll (
        postId: string,
        query: GetCommentQueryParams
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
            .exec()

        const items = result.map(CommentViewModel.mapToView)
        const totalCount = await this.CommentModel.countDocuments(filter)

        return CommentsPaginatedViewDto.mapToView({
            items,
            totalCount,
            page: pageNumber,
            size: pageSize
        })
    }
}
