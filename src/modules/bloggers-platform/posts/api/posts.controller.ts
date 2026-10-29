import { Body, Controller, Param, Post, Get, Query, Put, HttpStatus, HttpCode, Delete, UseGuards } from '@nestjs/common';
import { PostInputModel } from './inputDto/post.input-dto.js';
import { PostsQwRepo } from '../infrastructure/posts.query-repository.js';
import { PostViewModel } from './viewDto/post.view-dto.js';
import { GetPostsQueryParams } from './inputDto/get-posts-query-params.input-dto.js';
import { PostPagindatedViewDto } from './viewDto/posts.paginated.view-dto.js';
import { GetCommentQueryParams } from '../../comments/api/inputDto/get-comments-qury-params.input-dto.js';
import { CommentsPaginatedViewDto } from '../../comments/api/viewDto/comments.paginated.view-dto.js';
import { CommentsQwRepo } from '../../comments/infrastructure/comments.query-repository.js';
import { PostsRepository } from '../infrastructure/posts.repository.js';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../application/usecases/create-post.usecase.js';
import { UpdatePostCommand } from '../application/usecases/update-post.usecase.js';
import { DeletePostCommand } from '../application/usecases/delete-post.usecase.js';
import { JwtAuthGuard } from '../../../user-accounts/guards/bearer/jwt-auth.guard.js';
import { CommentInputModel } from '../../comments/api/inputDto/create-comment.input-dto.js';
import { CommentViewModel } from '../../comments/api/viewDto/comments.view-dto.js';
import { UserContextDto } from '../../../user-accounts/guards/dto/user-context.dto.js';
import { ExtractUserFromRequest } from '../../../user-accounts/guards/decorators/param/extract-user-from-request.js';
import { CreateCommentCommand } from '../../comments/application/create-comment.usecase.js';

@Controller('posts')
export class PostsController {

    constructor (
        private postsQwRepo: PostsQwRepo,
        private postsRepository: PostsRepository,
        private commentsQwRepo: CommentsQwRepo,

        private commandBus: CommandBus
    ) {}

    @Post()
    async createPost (
        @Body() body: PostInputModel
    ): Promise<PostViewModel> { 
        const id = await this.commandBus.execute<CreatePostCommand, string>(new CreatePostCommand({...body}))

        const postView = await this.postsQwRepo.getByIdOrFail(id)

        return postView
    }

    @Get()
    async getPostsList(
        @Query() query: GetPostsQueryParams
    ): Promise<PostPagindatedViewDto> {
        return await this.postsQwRepo.getAll(query)
    }

    @Get(':id')
    async getPostById (
        @Param('id') id: string
    ): Promise<PostViewModel> {
        return await this.postsQwRepo.getByIdOrFail(id)
    }

    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePostById (
        @Param('id') id: string,
        @Body() body: PostInputModel
    ): Promise<void> {
        return await this.commandBus.execute<UpdatePostCommand, void>(new UpdatePostCommand(id, {...body}))
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePostById (
        @Param('id') id: string
    ): Promise<void> {
        await this.commandBus.execute<DeletePostCommand, void>(new DeletePostCommand(id))
    }

    // Comment
    @Get(':postId/comments')
    async getCommentsListForPostById(
        @Param('postId') postId: string,
        @Query() query: GetCommentQueryParams
    ): Promise<CommentsPaginatedViewDto> {
        await this.postsRepository.findById(postId)

        return await this.commentsQwRepo.getAll(postId, query)
    }

    @UseGuards(JwtAuthGuard)
    @Post(':postId/comments')
    async createComment (
        @Param('postId') postId: string,
        @Body() body: CommentInputModel,
        @ExtractUserFromRequest() user: UserContextDto 
    ): Promise<CommentViewModel> {
        const { content } = body
        const userId = user.id

        const id = await this.commandBus.execute<CreateCommentCommand, string>(new CreateCommentCommand(userId, postId, content))

        const commentView = this.commentsQwRepo.getCommentByIdOrFail(id)

        return commentView
    }

}
