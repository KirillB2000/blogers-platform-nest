import { Module } from '@nestjs/common';
import { BlogsController } from './api/blogs.controller.js';
import { BlogsService } from './application/blogs.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blogs.entity.js';
import { BlogsRepository } from './infrastructure/blogs.repository.js';
import { PostsModule } from '../posts/posts.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}]),
    PostsModule
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsRepository]
})
export class BlogsModule {}
