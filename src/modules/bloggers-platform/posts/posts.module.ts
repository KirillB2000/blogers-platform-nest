import { Module } from '@nestjs/common';
import { PostsController } from './api/posts.controller.js';
import { PostsService } from './application/posts.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './domain/posts.entity.js';
import { BlogsModule } from '../blogs/blogs.module.js';
import { CommentsModule } from '../comments/comments.module.js';
import { PostsQwRepo } from './infrastructure/posts.query-repository.js';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]),
    BlogsModule,
    CommentsModule
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsQwRepo, PostsService]
})
export class PostsModule {}
