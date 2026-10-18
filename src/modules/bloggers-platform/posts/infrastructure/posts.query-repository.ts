import { Injectable, NotFoundException } from "@nestjs/common";
import { GetPostsQueryParams } from "../api/inputDto/get-posts-query-params.input-dto.js";
import { InjectModel } from "@nestjs/mongoose";
import { Post, type PostModelType } from "../domain/posts.entity.js";
import { PostViewModel } from "../api/viewDto/post.view-dto.js";
import { PostPagindatedViewDto } from "../api/viewDto/posts.paginated.view-dto.js";


@Injectable()
export class PostsQwRepo {
    
    constructor (
        @InjectModel(Post.name)
        private PostModel: PostModelType
    ) {}

    async getAll (
        query: GetPostsQueryParams,
        blogId?: string
    ) {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        } = query

        const filter: any = {}
        const skip = query.calculateSkip()

        if (blogId) {
            filter.blogId = blogId
        }

        const result = await this.PostModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .exec()

        const totalCount = await this.PostModel.countDocuments(filter)

        const items = result.map(PostViewModel.mapToView)

        return PostPagindatedViewDto.mapToView({
            items,
            totalCount,
            page: pageNumber,
            size: pageSize
        })
    }

    async getByIdOrFail (
        id: string
    ): Promise<PostViewModel> {
        const postDoc = await this.PostModel.findById(id)

        if (!postDoc) {
            throw new NotFoundException('Post not found')
        }

        return PostViewModel.mapToView(postDoc)
    }
} 