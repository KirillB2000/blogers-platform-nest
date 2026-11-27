import { InjectModel } from "@nestjs/mongoose";
import { Post, PostDocument, type PostModelType } from "../domain/posts.entity.js";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { PostDbRow } from "../domain/post-sql-model.js";

@Injectable()
export class PostsRepository {
    constructor (
        @InjectModel(Post.name)
        private PostModel: PostModelType,

        @InjectDataSource()
        private dataSource: DataSource
    ) {}

    async save (postDoc: PostDocument) {
        await postDoc.save()
    }

    async findById (
        id: string
    ): Promise<PostDocument | null> {
        const postDoc = await this.PostModel.findById(id)

        return postDoc
    }

    async deleteById (
        blogId: number,
        postId: number
    ): Promise<boolean> {

        const [ , deletedRows ] = await this.dataSource.query(
            `
                DELETE FROM posts
                WHERE id=$2 AND blog_id=$1 
            `,
            [blogId, postId]
        )
        
        return deletedRows > 0
    }

    async createPost (
        title: string,
        shortDescription: string,
        content: string,
        blogId: number 
    ): Promise<number> {
        
        const postIdsDbRows: Pick<PostDbRow, 'id'>[] = await this.dataSource.query(
            `
                INSERT INTO posts (title, short_description, content, blog_id)
                    VALUES ($1, $2, $3, $4)
                RETURNING id
            `,
            [title, shortDescription, content, blogId ]
        )

        return postIdsDbRows[0].id
        
    }

    async postExistence(
        postId: number
    ): Promise<boolean> {
        const existsArr: {exists: boolean}[] = await this.dataSource.query(
            `
                SELECT EXISTS(SELECT 1 FROM posts WHERE id=$1)
            `,
            [postId]
        )

        return existsArr[0].exists
    }

    async updatePostForSpecificBlog(
        blogId: number,
        title: string,
        shortDescription: string,
        content: string,
        postId: number
    ): Promise<boolean> {
        const [, affectedRows] = await this.dataSource.query(
            `
                UPDATE posts
                SET title=$2,
                    short_description=$3,
                    content=$4,
                    updated_at=NOW()
                WHERE id=$5 AND blog_id=$1
            `,
            [blogId, title, shortDescription, content, postId]
        )

        return affectedRows > 0
    }
}