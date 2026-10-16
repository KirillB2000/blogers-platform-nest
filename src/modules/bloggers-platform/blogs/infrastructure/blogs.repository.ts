import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Blog, BlogDocument, type BlogModelType } from "../domain/blogs.entity.js";

@Injectable()
export class BlogsRepository {
    constructor(
        @InjectModel(Blog.name)
        private BlogModel: BlogModelType
    ) {}

    async save(blogDoc: BlogDocument) {
        await blogDoc.save()
    }

    async findByIdOrFail (
        id: string
    ): Promise<BlogDocument> {
        const blogDoc = await this.BlogModel.findById(id)

        if (!blogDoc) {
            throw new NotFoundException('Blog not found')
        }

        return blogDoc
    }
    
    async deleteBlogByIdOrFail(
        id: string
    ): Promise<void> {
        const result = await this.BlogModel.deleteOne({_id: id})

        if (result.deletedCount === 0) {
            throw new NotFoundException('Blog not found')
        }
    }
}