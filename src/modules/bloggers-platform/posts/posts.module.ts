import { Module } from '@nestjs/common';
import { PostsController } from './api/posts.controller.js';
import { PostsService } from './application/posts.service.js';

@Module({
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
