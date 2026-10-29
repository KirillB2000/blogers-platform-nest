import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { CommentsQwRepo } from '../infrastructure/comments.query-repository.js';
import { CommentViewModel } from './viewDto/comments.view-dto.js';
import { CommandBus } from '@nestjs/cqrs';
import { ExtractUserFromRequest } from '../../../user-accounts/guards/decorators/param/extract-user-from-request.js';
import { UserContextDto } from '../../../user-accounts/guards/dto/user-context.dto.js';
import { JwtAuthGuard } from '../../../user-accounts/guards/bearer/jwt-auth.guard.js';
import { DeleteCommentCommand } from '../application/delete-comment.usecase.js';
import { CommentInputModel } from './inputDto/create-comment.input-dto.js';
import { UpdateCommentCommand } from '../application/update-comment.usecase.js';

@Controller('comments')
export class CommentsController {

    constructor(
        private commentsQwRepo: CommentsQwRepo,
        private commandBus: CommandBus
    ) {}

    @Get(':id')
    async getCommentById(
        @Param('id') id: string
    ): Promise<CommentViewModel> {
        return this.commentsQwRepo.getCommentByIdOrFail(id)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':commentId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCommendById(
        @ExtractUserFromRequest() user: UserContextDto,
        @Param('commentId') commentId: string
    ): Promise<void> {
        const userId = user.id
        await this.commandBus.execute<DeleteCommentCommand, void>(new DeleteCommentCommand(userId, commentId))
    }

    @UseGuards(JwtAuthGuard)
    @Put(':commentId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateCommentById (
        @ExtractUserFromRequest() user: UserContextDto,
        @Param('commentId') commentId: string,
        @Body() body: CommentInputModel
    ): Promise<void> {
        const userId = user.id
        const { content } = body

        await this.commandBus.execute<UpdateCommentCommand, void>(new UpdateCommentCommand(userId, commentId, content))
    }

}
