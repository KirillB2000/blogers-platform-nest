import { Module } from '@nestjs/common';
import { CommentsController } from './api/comments.controller.js';
import { CommentsService } from './application/comments.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentsSchema } from './domain/comments.entity.js';
import { CommentsQwRepo } from './infrastructure/comments.query-repository.js';
import { DeleteCommentUseCase } from './application/delete-comment.usecase.js';
import { UpdateCommentUseCase } from './application/update-comment.usecase.js';
import { UserAccountsModule } from '../../user-accounts/user-accounts.module.js';
import { CommentsRepositroy } from './infrastructure/comments.repository.js';
import { LikeStatusComment, LikeStatusCommentSchema } from './domain/comment-like-status.entity.js';
import { UpdateCommentLikeStatusUseCase } from './application/update-comment-like-status.usecase.js';
import { CommentsLikeStatusRepository } from './infrastructure/comments-like-status.repository.js';

export const commentsUsecases = [
  DeleteCommentUseCase,
  UpdateCommentUseCase,
  UpdateCommentLikeStatusUseCase
]

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentsSchema },
      { name: LikeStatusComment.name, schema: LikeStatusCommentSchema }
    ]),
    UserAccountsModule
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService, 
    CommentsQwRepo,
    CommentsRepositroy,
    CommentsLikeStatusRepository,

    ...commentsUsecases
  ],
  exports: [CommentsService, CommentsQwRepo]
})
export class CommentsModule {}
