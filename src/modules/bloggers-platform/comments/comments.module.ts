import { Module } from '@nestjs/common';
import { CommentsController } from './api/comments.controller.js';
import { CommentsService } from './application/comments.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentsSchema } from './domain/comments.entity.js';
import { CommentsQwRepo } from './infrastructure/comments.query-repository.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentsSchema }])
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsQwRepo],
  exports: [CommentsService, CommentsQwRepo]
})
export class CommentsModule {}
