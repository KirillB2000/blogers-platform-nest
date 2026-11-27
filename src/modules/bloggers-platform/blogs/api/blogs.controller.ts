import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BlogsQwRepo } from '../infrastructure/blogs.query-repository.js';
import { BlogInputModel } from './inputDto/blogs.input-dto.js';
import { BlogViewModel } from './viewDto/blogs.view-dto.js';
import { GetBlogsQueryParams } from './inputDto/get-blogs-query-params.input-dto.js';
import { BlogsPaginatedViewDto } from './viewDto/blogs.paginated.view-dto.js';
import { GetPostsQueryParams } from '../../posts/api/inputDto/get-posts-query-params.input-dto.js';
import { BlogsRepository } from '../infrastructure/blogs.repository.js';
import { PostPagindatedViewDto } from '../../posts/api/viewDto/posts.paginated.view-dto.js';
import { PostsQwRepo } from '../../posts/infrastructure/posts.query-repository.js';
import { PostViewModel } from '../../posts/api/viewDto/post.view-dto.js';
import { BlogPostInputModel } from './inputDto/blog-post.input-dto.js';
import { PostInputModel } from '../../posts/api/inputDto/post.input-dto.js';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase.js';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase.js';
import { DeleteBlogCommand } from '../application/usecases/delete-blog.usecase.js';
import { CreatePostCommand } from '../../posts/application/usecases/create-post.usecase.js';
import { UserContextDto } from '../../../user-accounts/guards/dto/user-context.dto.js';
import { BasicAuthGuard } from '../../../user-accounts/guards/basic/basic-auth.guard.js';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/jwt-optional-auth.guard.js';
import { ExtractOptionalUser } from '../../../user-accounts/guards/decorators/param/extract-user-from-request-optional.js';

@Controller('blogs')
export class BlogsController {

    constructor (
        private postsQwRepo: PostsQwRepo,
        private blogsQwRepo: BlogsQwRepo,
        private blogsRepository: BlogsRepository,
    ) {}

    @Get()
    async getBlogList(
        @Query() query: GetBlogsQueryParams
    ): Promise<BlogsPaginatedViewDto> {
        return await this.blogsQwRepo.getAll(query)
    }

    @Get(':id')
    async getBlogById (
        @Param('id', ParseIntPipe) id: number
    ): Promise<BlogViewModel> {
        return this.blogsQwRepo.getBlogByIdOrFail(id)
    }
}
