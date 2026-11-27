import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Blog, BlogDocument, type BlogModelType } from "../domain/blogs.entity.js";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { BlogDbRow, BlogSqlModel } from "../domain/blog-sql-model.js";

@Injectable()
export class BlogsRepository {
    constructor(
        @InjectModel(Blog.name)
        private BlogModel: BlogModelType,
        
        @InjectDataSource() 
        private dataSource: DataSource
    ) {}

    async save(blogDoc: BlogDocument) {
        await blogDoc.save()
    }

    async createBlog (
        name: string,
        description: string,
        websiteUrl: string
    ): Promise<number> {
        const blogsDbRows: Pick<BlogDbRow, 'id'>[] = await this.dataSource.query(
            `
                INSERT INTO blogs (name, description, website_url)
                    VALUES ($1, $2, $3)
                RETURNING id
            `,
            [name, description, websiteUrl]
        )

        return blogsDbRows[0].id
    }

    async findById (
        id: number
    ): Promise<BlogSqlModel | null> {
        const blogsDbRows: BlogDbRow[] = await this.dataSource.query(
            `
                SELECT *
                FROM blogs
                WHERE id=$1
            `,
            [id]
        )

        const blogDbRow = blogsDbRows[0] ? blogsDbRows[0] : null 

        return blogDbRow ? BlogSqlModel.mapToModel(blogDbRow) : null
    }
    
    async deleteBlogById(
        id: number
    ): Promise<boolean> {
        const [, deletedRows] = await this.dataSource.query(
            `
                DELETE FROM blogs
                WHERE id=$1
            `,
            [id]
        )

        return deletedRows > 0
    }

    async updateById (
        id: number,
        name: string,
        description: string,
        websiteUrl: string
    ): Promise<boolean> {
        const [, affectedRows] = await this.dataSource.query(
            `
                UPDATE blogs
                SET name=$2,
                    description=$3,
                    website_url=$4,
                    updated_at=NOW()
                WHERE id=$1
            `,
            [id, name, description, websiteUrl]
        )

        return affectedRows > 0
    }

    async checkBlogExists(
        blogId: number
    ): Promise<boolean> {
        const existsArr: { exists: boolean }[] = await this.dataSource.query(
            `
                SELECT EXISTS(SELECT 1 FROM blogs WHERE id=$1)
            `,
            [blogId]
        )

        return existsArr[0].exists
    }
}