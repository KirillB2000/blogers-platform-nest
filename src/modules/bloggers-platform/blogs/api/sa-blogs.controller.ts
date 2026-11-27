import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '../../../user-accounts/guards/basic/basic-auth.guard.js';
import { BlogInputModel } from './inputDto/blogs.input-dto.js';
import { BlogViewModel } from './viewDto/blogs.view-dto.js';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase.js';
import { CommandBus } from '@nestjs/cqrs';
import { PostsQwRepo } from '../../posts/infrastructure/posts.query-repository.js';
import { BlogsQwRepo } from '../infrastructure/blogs.query-repository.js';
import { BlogsRepository } from '../infrastructure/blogs.repository.js';
import { GetBlogsQueryParams } from './inputDto/get-blogs-query-params.input-dto.js';
import { BlogsPaginatedViewDto } from './viewDto/blogs.paginated.view-dto.js';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase.js';
import { DeleteBlogCommand } from '../application/usecases/delete-blog.usecase.js';
import { PostInputModel } from '../../posts/api/inputDto/post.input-dto.js';
import { PostViewModel } from '../../posts/api/viewDto/post.view-dto.js';
import { CreatePostCommand } from '../../posts/application/usecases/create-post.usecase.js';
import { BlogPostInputModel } from './inputDto/blog-post.input-dto.js';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/jwt-optional-auth.guard.js';
import { ExtractOptionalUser } from '../../../user-accounts/guards/decorators/param/extract-user-from-request-optional.js';
import { UserContextDto } from '../../../user-accounts/guards/dto/user-context.dto.js';
import { GetPostsQueryParams } from '../../posts/api/inputDto/get-posts-query-params.input-dto.js';
import { PostPagindatedViewDto } from '../../posts/api/viewDto/posts.paginated.view-dto.js';
import { UpdatePostCommand } from '../../posts/application/usecases/update-post.usecase.js';
import { id } from 'date-fns/locale';
import { DeletePostCommand } from '../../posts/application/usecases/delete-post.usecase.js';

@Controller('sa/blogs')
export class SaBlogsController {
    
    constructor(
        private postsQwRepo: PostsQwRepo,
        private blogsQwRepo: BlogsQwRepo,
        private blogsRepository: BlogsRepository,


        private commandBus: CommandBus
    ) { }

    @UseGuards(BasicAuthGuard)
    @Post()
    async createBlog(
        @Body() body: BlogInputModel
    ): Promise<BlogViewModel> {
        const blogId = await this.commandBus.execute<CreateBlogCommand, number>(new CreateBlogCommand({ ...body }))

        const blog = await this.blogsQwRepo.getBlogByIdOrFail(blogId)
        return blog
    }

    @Get()
    async getBlogList(
        @Query() query: GetBlogsQueryParams
    ): Promise<BlogsPaginatedViewDto> {
        return await this.blogsQwRepo.getAll(query)
    }

    @UseGuards(BasicAuthGuard)
    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateBlogById(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: BlogInputModel
    ): Promise<void> {
        await this.commandBus.execute<UpdateBlogCommand, void>(new UpdateBlogCommand(id, { ...body }))
    }

    @UseGuards(BasicAuthGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlogById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<void> {
        await this.commandBus.execute<DeleteBlogCommand, void>(new DeleteBlogCommand(id))
    }

    // Posts

    @UseGuards(BasicAuthGuard)
    @Post(':blogId/posts')
    async createPostForBlog(
        @Param('blogId', ParseIntPipe) blogId: number,
        @Body() body: BlogPostInputModel
    ): Promise<PostViewModel> {
        const correctDto: PostInputModel = { ...body, blogId }

        const postId = await this.commandBus.execute<CreatePostCommand, number>(new CreatePostCommand(correctDto))

        const postViewData = await this.postsQwRepo.getByIdOrFail(postId)

        return postViewData
    }

    @UseGuards(BasicAuthGuard)
    @Get(':blogId/posts')
    async getPostsListForBlogById(
        @Param('blogId', ParseIntPipe) blogId: number,
        @Query() query: GetPostsQueryParams,
        @ExtractOptionalUser() user?: UserContextDto // TODO Not work with basic auth, delete later
    ): Promise<PostPagindatedViewDto> {
        const userId = user ? user.id : null
        await this.blogsQwRepo.checkBlogExistsOrFail(blogId)

        return this.postsQwRepo.getAll(query, userId, blogId)
    }

    @UseGuards(BasicAuthGuard)
    @Put(':blogId/posts/:postId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateExistingPostById (
        @Param('blogId', ParseIntPipe) blogId: number,
        @Param('postId', ParseIntPipe) postId: number,
        @Body() body: BlogPostInputModel
    ): Promise<void> {
        
        return await this.commandBus.execute<UpdatePostCommand, void>(new UpdatePostCommand(blogId, postId, {...body}))
    }

    @UseGuards(BasicAuthGuard)
    @Delete(':blogId/posts/:postId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePostById (
        @Param('blogId', ParseIntPipe) blogId: number,
        @Param('postId', ParseIntPipe) postId: number
    ): Promise<void> {
        await this.commandBus.execute<DeletePostCommand, void>(new DeletePostCommand(blogId, postId))
    }
}
