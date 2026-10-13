import { Injectable, NotFoundException } from "@nestjs/common";
import { CommentViewModel } from "../api/viewDto/comments.view-dto.js";
import { Comment, type CommentModelType } from "../domain/comments.entity.js";
import { InjectModel } from "@nestjs/mongoose";

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
}