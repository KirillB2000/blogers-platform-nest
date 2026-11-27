import { Injectable, NotFoundException } from "@nestjs/common";
import { GetPostsQueryParams } from "../api/inputDto/get-posts-query-params.input-dto.js";
import { PostViewModel } from "../api/viewDto/post.view-dto.js";
import { PostPagindatedViewDto } from "../api/viewDto/posts.paginated.view-dto.js";
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto.js";
import { PostDbRowWithBlogName } from "../domain/post-sql-model.js";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { PostsSortBy } from "../api/inputDto/posts-sort-by.js";
import { SortDirection } from "../../../../core/dto/base.query-params.input-dto.js";


@Injectable()
export class PostsQwRepo {
    
    constructor (
        @InjectDataSource()
        private dataSource: DataSource
    ) {}

    async getAll (
        query: GetPostsQueryParams,
        userId?: number | null,
        blogId?: number
    ): Promise<PaginatedViewDto<PostViewModel[]>> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        } = query

        const skip = query.calculateSkip()

        const conditions: string[] = []
        const params: any[] = []

        if (blogId) {
            params.push(blogId)
            conditions.push(`p.blog_id=$${params.length}`)
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''


        const safeSortBy = Object.values(PostsSortBy).includes(sortBy)
            ? sortBy
            : PostsSortBy.CreatedAt
        const safeSortDirection = sortDirection === SortDirection.Asc ? 'asc' : 'desc'

        const postsDbRowsBN: PostDbRowWithBlogName[] = await this.dataSource.query (
            `
                SELECT p.id, p.title, p.short_description, p.content, p.blog_id, p.created_at, b.name as blog_name
                FROM posts p
                INNER JOIN blogs b
                ON p.blog_id=b.id
                ${whereClause}
                ORDER BY p.${safeSortBy} ${safeSortDirection}
                LIMIT $${params.length + 1}
                OFFSET $${params.length + 2}
            `,
            [...params, pageSize, skip]
        )

        const countDbRows: {count: string}[] = await this.dataSource.query(
            `
                SELECT COUNT(*)
                FROM posts p
                ${whereClause}
            `,
            [...params]
        )

        const totalCount = countDbRows[0].count

        const items = postsDbRowsBN.map(postDbRow => PostViewModel.mapToView(postDbRow))

        return PostPagindatedViewDto.mapToView({
            items: items,
            totalCount,
            page: pageNumber,
            size: pageSize
        })
    }

    async getByIdOrFail (
        postId: number,
        userId?: number | null
    ): Promise<PostViewModel> {

        const postsDbRows: PostDbRowWithBlogName[] = await this.dataSource.query(
            `
                SELECT p.id, p.title, p.short_description, p.content, p.blog_id, p.created_at, b.name as blog_name
                FROM posts p
                INNER JOIN blogs b
                ON p.blog_id=b.id
                WHERE p.id=$1
            `,
            [postId]
        )

        const postDbRowBN = postsDbRows[0] ? postsDbRows[0] : null

        if (!postDbRowBN) {
            throw new NotFoundException('Post not found')
        }

        return PostViewModel.mapToView(postDbRowBN)
    }
} 