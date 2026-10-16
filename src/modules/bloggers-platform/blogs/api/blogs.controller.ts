import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service.js';
import { BlogsQwRepo } from '../infrastructure/blogs.query-repository.js';
import { BlogInputModel } from './inputDto/blogers.input-dto.js';
import { BlogViewModel } from './viewDto/blogers.view-dto.js';
import { GetBlogsQueryParams } from './inputDto/get-blogs-query-params.input-dto.js';
import { BlogsPaginatedViewDto } from './viewDto/blogers.paginated.view-dto.js';

@Controller('blogs')
export class BlogsController {

    constructor (
        private blogsQwRepo: BlogsQwRepo,
        private blogsService: BlogsService
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
        const blogId = await this.blogsService.createBlog(body)

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
        await this.blogsService.updateBlog(id, body)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlogById (
        @Param('id') id: string
    ): Promise<void> {
        await this.blogsService.deleteBlog(id)
    }
}
