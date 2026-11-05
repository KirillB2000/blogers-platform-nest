import { HttpStatus, INestApplication } from "@nestjs/common";
import { PostInputModel } from "../../src/modules/bloggers-platform/posts/api/inputDto/post.input-dto.js";
import { BasicAuthTest } from "../utils/basicAuthTest.js";
import request from 'supertest'
import { CommentInputModel } from "../../src/modules/bloggers-platform/comments/api/inputDto/create-comment.input-dto.js";
import { PostViewModel } from "../../src/modules/bloggers-platform/posts/api/viewDto/post.view-dto.js";
import { CommentViewModel } from "../../src/modules/bloggers-platform/comments/api/viewDto/comments.view-dto.js";

export class PostTestsHelpers {
    constructor (
        private app: INestApplication,
        private basicAuthTest: BasicAuthTest
    ) {}

    // STATIC DTO METHODS

    static createPostDtoDefault (
        title: string,
        shortDescription: string,
        content: string,
        blogId: string
    ): PostInputModel {
        return {
            title,
            shortDescription,
            content,
            blogId
        }
    }

    static createCommentDtoDefault (
        content: string
    ): CommentInputModel {
        return {
            content
        }
    }

    // INSTANCE METHODS

    async createPostDefault (
        title: string,
        shortDescription: string,
        content: string,
        blogId: string
    ): Promise<PostViewModel> {
        const dto = PostTestsHelpers.createPostDtoDefault(
            title,
            shortDescription,
            content,
            blogId
        )

        const basicAuthToken = this.basicAuthTest.generateBasicAuthToken()

        const response = await request(this.app.getHttpServer())
            .post('/posts')
            .set('Authorization', basicAuthToken)
            .send(dto)
            .expect(HttpStatus.CREATED)

        return response.body as PostViewModel
    }

    async createCommentForPostDefault (
        conent: string,
        postId: string,
        token: string
    ): Promise<CommentViewModel> {
        const dto = PostTestsHelpers.createCommentDtoDefault(conent)

        const response = await request(this.app.getHttpServer())
            .post(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send(dto)
            .expect(HttpStatus.CREATED)

        return response.body as CommentViewModel
    }
}