import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
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

@Controller('blogs')
export class BlogsController {

    constructor (
        private postsQwRepo: PostsQwRepo,
        private blogsQwRepo: BlogsQwRepo,
        private blogsRepository: BlogsRepository,

        private commandBus: CommandBus
    ) {}

    @Get()
    async getBlogList(
        @Query() query: GetBlogsQueryParams
    ): Promise<BlogsPaginatedViewDto> {
        return this.blogsQwRepo.getAll(query)
    }

    @Post()
    async createBlog (
        @Body() body: BlogInputModel
    ): Promise<BlogViewModel> {
        const blogId = await this.commandBus.execute<CreateBlogCommand, string>(new CreateBlogCommand({...body}))

        const blog = await this. blogsQwRepo.getBlogByIdOrFail(blogId)
        return blog
    }

    @Get(':id')
    async getBlogById (
        @Param('id') id: string
    ): Promise<BlogViewModel> {
        return this.blogsQwRepo.getBlogByIdOrFail(id)
    }

    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateBlogById(
        @Param('id') id: string,
        @Body() body: BlogInputModel
    ): Promise<void> {
        await this.commandBus.execute<UpdateBlogCommand, void>(new UpdateBlogCommand(id, {...body}))
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlogById (
        @Param('id') id: string
    ): Promise<void> {
        await this.commandBus.execute<DeleteBlogCommand, void>(new DeleteBlogCommand(id))
    }

    // Posts
    @Get(':blogId/posts')
    async getPostsListForBlogById (
        @Param('blogId') blogId: string,
        @Query() query: GetPostsQueryParams
    ): Promise<PostPagindatedViewDto> {
        await this.blogsRepository.findByIdOrFail(blogId)

        return this.postsQwRepo.getAll(query, blogId)
    }

    @Post(':blogId/posts')
    async createPostForBlog (
        @Param('blogId') blogId: string,
        @Body() body: BlogPostInputModel
    ): Promise<PostViewModel> {
        const correctDto: PostInputModel = {...body, blogId}

        const postId = await this.commandBus.execute<CreatePostCommand, string>(new CreatePostCommand(correctDto))

        const postViewData = await this.postsQwRepo.getByIdOrFail(postId)

        return postViewData
    }
}
