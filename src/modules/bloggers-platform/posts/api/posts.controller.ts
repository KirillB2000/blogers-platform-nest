import { Body, Controller, Param, Post, Get, Query, Put, HttpStatus, HttpCode, Delete } from '@nestjs/common';
import { PostInputModel } from './inputDto/post.input-dto.js';
import { PostsQwRepo } from '../infrastructure/posts.query-repository.js';
import { PostsService } from '../application/posts.service.js';
import { PostViewModel } from './viewDto/post.view-dto.js';
import { GetPostsQueryParams } from './inputDto/get-posts-query-params.input-dto.js';
import { PostPagindatedViewDto } from './viewDto/posts.paginated.view-dto.js';
import { GetCommentQueryParams } from '../../comments/api/inputDto/get-comments-qury-params.input-dto.js';
import { CommentsPaginatedViewDto } from '../../comments/api/viewDto/comments.paginated.view-dto.js';
import { CommentsQwRepo } from '../../comments/infrastructure/comments.query-repository.js';
import { PostsRepository } from '../infrastructure/posts.repository.js';

@Controller('posts')
export class PostsController {

    constructor (
        private commentsQwRepo: CommentsQwRepo,
        private postsQwRepo: PostsQwRepo,
        private postsRepository: PostsRepository,
        private postsService: PostsService
    ) {}

    @Post()
    async createPost (
        @Body() body: PostInputModel
    ): Promise<PostViewModel> { 
        return await this.postsService.createPost(body)
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
        return await this.postsService.updatePost(id, body)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePostById (
        @Param('id') id: string
    ): Promise<void> {
        await this.postsService.deletePost(id)
    }

    // Comment
    @Get(':postId/comments')
    async getCommentsListForPostById(
        @Param('postId') postId: string,
        @Query() query: GetCommentQueryParams
    ): Promise<CommentsPaginatedViewDto> {
        await this.postsRepository.findByIdOrFail(postId)

        return await this.commentsQwRepo.getAll(postId, query)
    }
}
