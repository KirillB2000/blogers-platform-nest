import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentDocument, type CommentModelType } from "../domain/comments.entity.js";

@Injectable()
export class CommentsRepositroy {
    
    constructor (
        @InjectModel(Comment.name)
        private CommentModel: CommentModelType
    ) {}

    async save(commentDoc: CommentDocument) {
        await commentDoc.save()
    }

    async deleteCommentById (
        commentId: string
    ): Promise<boolean> {
        const deletionResult = await this.CommentModel.deleteOne({id: commentId})

        return deletionResult.deletedCount > 0
    }

    async findById(
        commentId: string
    ): Promise<CommentDocument | null> {
        const commentDoc = this.CommentModel.findById(commentId).exec()

        return commentDoc
    }
}
