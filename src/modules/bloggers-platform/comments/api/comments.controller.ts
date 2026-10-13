import { Controller, Get, Param } from '@nestjs/common';
import { CommentsQwRepo } from '../infrastructure/comments.query-repository.js';
import { CommentViewModel } from './viewDto/comments.view-dto.js';

@Controller('comments')
export class CommentsController {

    constructor(
        private commentsQwRepo: CommentsQwRepo
    ) {}

    @Get(':id')
    async getCommentById(
        @Param('id') id: string
    ): Promise<CommentViewModel> {
        return this.commentsQwRepo.getCommentByIdOrFail(id)
    }

}
