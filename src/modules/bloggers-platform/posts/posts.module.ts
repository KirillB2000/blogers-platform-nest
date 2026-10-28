import { Module, forwardRef } from '@nestjs/common';
import { PostsController } from './api/posts.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './domain/posts.entity.js';
import { BlogsModule } from '../blogs/blogs.module.js';
import { CommentsModule } from '../comments/comments.module.js';
import { PostsQwRepo } from './infrastructure/posts.query-repository.js';
import { PostsRepository } from './infrastructure/posts.repository.js';
import { CreatePostUseCase } from './application/usecases/create-post.usecase.js';
import { DeletePostUseCase } from './application/usecases/delete-post.usecase.js';
import { UpdatePostUseCase } from './application/usecases/update-post.usecase.js';

const postUseCases = [
  CreatePostUseCase,
  DeletePostUseCase,
  UpdatePostUseCase
]

@Module({
  imports: [
    MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]),
    forwardRef(() => BlogsModule),
    CommentsModule
  ],
  controllers: [PostsController],
  providers: [
    PostsRepository, 
    PostsQwRepo,

    ...postUseCases
  ],
  exports: [PostsQwRepo]
})
export class PostsModule {}
