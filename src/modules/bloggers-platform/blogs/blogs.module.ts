import { Module, forwardRef } from '@nestjs/common';
import { BlogsController } from './api/blogs.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blogs.entity.js';
import { BlogsRepository } from './infrastructure/blogs.repository.js';
import { BlogsQwRepo } from './infrastructure/blogs.query-repository.js';
import { PostsModule } from '../posts/posts.module.js';
import { CreateBlogUseCase } from './application/usecases/create-blog.usecase.js';
import { UpdateBlogUseCase } from './application/usecases/update-blog.usecase.js';
import { DeleteBlogUseCase } from './application/usecases/delete-blog.usecase.js';

const blogsUseCases = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase
]

@Module({
  imports: [
    MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}]),
    forwardRef(() => PostsModule )
  ],
  controllers: [BlogsController],
  providers: [ 
    BlogsRepository, 
    BlogsQwRepo,

    ...blogsUseCases
  ],
  exports: [BlogsRepository]
})
export class BlogsModule {}
