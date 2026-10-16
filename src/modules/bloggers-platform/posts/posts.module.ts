import { Module, forwardRef } from '@nestjs/common';
import { PostsController } from './api/posts.controller.js';
import { PostsService } from './application/posts.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './domain/posts.entity.js';
import { BlogsModule } from '../blogs/blogs.module.js';
import { CommentsModule } from '../comments/comments.module.js';
import { PostsQwRepo } from './infrastructure/posts.query-repository.js';
import { PostsRepository } from './infrastructure/posts.repository.js';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]),
    forwardRef(() => BlogsModule),
    CommentsModule
  ],
  controllers: [PostsController],
  providers: [PostsRepository, PostsService, PostsQwRepo],
  exports: [PostsQwRepo, PostsService]
})
export class PostsModule {}
