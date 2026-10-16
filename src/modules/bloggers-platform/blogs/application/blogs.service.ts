import { Injectable } from '@nestjs/common';
import { BlogInputModel } from '../api/inputDto/blogs.input-dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, type BlogModelType } from '../domain/blogs.entity.js';
import { BlogsRepository } from '../infrastructure/blogs.repository.js';

@Injectable()
export class BlogsService {

    constructor (
        @InjectModel(Blog.name)
        private BlogModel: BlogModelType,
        private blogRepository: BlogsRepository
    ) {}

    async createBlog(
        dto: BlogInputModel
    ): Promise<string> {
        const blog = this.BlogModel.createInstance({
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            isMembership: false
        })

        await this.blogRepository.save(blog)

        return blog.id
    }
    

    async updateBlog (
        id: string,
        dtoWithUpdateData: BlogInputModel
    ): Promise<void> {
        const blogDoc = await this.blogRepository.findByIdOrFail(id)

        blogDoc.update(dtoWithUpdateData)

        await this.blogRepository.save(blogDoc)
    }

    async deleteBlog (
        id: string
    ): Promise<void> {
        await this.blogRepository.deleteBlogByIdOrFail(id)
    }
}
