import { Module } from '@nestjs/common';
import { PostsController } from './api/posts.controller.js';
import { PostsService } from './application/posts.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './domain/posts.entity.js';
import { BlogsModule } from '../blogs/blogs.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]),
    BlogsModule
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
