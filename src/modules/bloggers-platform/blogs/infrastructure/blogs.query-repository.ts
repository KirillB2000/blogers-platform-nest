import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Blog, type BlogModelType } from "../domain/blogs.entity.js";
import { BlogViewModel } from "../api/viewDto/blogs.view-dto.js";
import { GetBlogsQueryParams } from "../api/inputDto/get-blogs-query-params.input-dto.js";
import { BlogsPaginatedViewDto } from "../api/viewDto/blogs.paginated.view-dto.js";

@Injectable()
export class BlogsQwRepo {
    constructor(
        @InjectModel(Blog.name)
        private BlogModel: BlogModelType
    ) {}

    async getBlogByIdOrFail(
        id: string
    ): Promise<BlogViewModel> {
        const blogDoc = await this.BlogModel.findById(id)

        if (!blogDoc) {
            throw new NotFoundException('Blog not found')
        }

        return BlogViewModel.mapToView(blogDoc)
    }

    async getAll(
        query: GetBlogsQueryParams
    ): Promise<BlogsPaginatedViewDto > {
        const {
            sortBy,
            searchNameTerm,
            pageNumber,
            pageSize,
            sortDirection
        } = query

        const filter: any = {}
        const skip = query.calculateSkip()

        if (searchNameTerm) {
            filter.$or = []
            filter.$or.push({name: {$regex: searchNameTerm, $options: 'i'}})
        }

        const result = await this.BlogModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .exec()

        const totalCount = await this.BlogModel.countDocuments(filter)

        const items = result.map(BlogViewModel.mapToView)

        return BlogsPaginatedViewDto.mapToView({
            items,
            page: pageNumber,
            size: pageSize,
            totalCount 
        })
    }
}