import { Injectable, NotFoundException } from "@nestjs/common";
import { BlogViewModel } from "../api/viewDto/blogs.view-dto.js";
import { GetBlogsQueryParams } from "../api/inputDto/get-blogs-query-params.input-dto.js";
import { BlogsPaginatedViewDto } from "../api/viewDto/blogs.paginated.view-dto.js";
import { BlogDbRow } from "../domain/blog-sql-model.js";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { BlogsSortBy } from "../api/inputDto/blogs-sort-by.js";
import { SortDirection } from "../../../../core/dto/base.query-params.input-dto.js";

@Injectable()
export class BlogsQwRepo {
    constructor(
        @InjectDataSource()
        private dataSource: DataSource
    ) {}

    async getBlogByIdOrFail(
        id: number
    ): Promise<BlogViewModel> {

        const blogsDbRows: BlogDbRow[] = await this.dataSource.query(
            `
                SELECT *
                FROM blogs
                WHERE id=$1
            `,
            [id]
        )

        if (!blogsDbRows[0]) {
            throw new NotFoundException('Blog not found')
        }

        return BlogViewModel.mapToView(blogsDbRows[0])
    }

    async getAll(
        query: GetBlogsQueryParams
    ): Promise<BlogsPaginatedViewDto> {
        const {
            sortBy,
            searchNameTerm,
            pageNumber,
            pageSize,
            sortDirection
        } = query

        const skip = query.calculateSkip()

        const conditions: string[] = []
        const params: any[] = []

        if (searchNameTerm) {
            params.push(`%${searchNameTerm}%`)
            conditions.push(`name ILIKE $${params.length}`)
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' OR ')}` : ''

        const safeSortBy = Object.values(BlogsSortBy).includes(sortBy)
                    ? sortBy
                    : BlogsSortBy.CreatedAt;
        const safeSortDirection = sortDirection === SortDirection.Asc ? 'asc' : 'desc';

        const blogsDbRows: BlogDbRow[] = await this.dataSource.query(
            `
                SELECT *
                FROM blogs
                ${whereClause}
                ORDER BY ${safeSortBy} ${safeSortDirection}
                LIMIT $${params.length + 1}
                OFFSET $${params.length + 2}
            `,
            [...params, pageSize, skip]
        )

        const totalCountArr: {count: string}[] = await this.dataSource.query(
            `
                SELECT COUNT(*)
                FROM blogs
                ${whereClause}
            `,
            [...params]
        )

        const totalCount = totalCountArr[0].count

        const items = blogsDbRows.map(BlogViewModel.mapToView)

        return BlogsPaginatedViewDto.mapToView({
            items,
            page: pageNumber,
            size: pageSize,
            totalCount 
        })
    }

    async checkBlogExistsOrFail(
        blogId: number
    ): Promise<void> {
        const existsArr: { exists: boolean }[] = await this.dataSource.query(
            `
                SELECT EXISTS(SELECT 1 FROM blogs WHERE id=$1)
            `,
            [blogId]
        )

        if (!existsArr[0].exists) {
            throw new NotFoundException('Blog not found')
        }
    }
}