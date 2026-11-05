import { HttpStatus, INestApplication } from "@nestjs/common";
import { PostInputModel } from "../../src/modules/bloggers-platform/posts/api/inputDto/post.input-dto.js";
import { BasicAuthTest } from "../utils/basicAuthTest.js";
import request, { Response } from 'supertest'

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

    // INSTANCE METHODS

    async createPostDefault (
        title: string,
        shortDescription: string,
        content: string,
        blogId: string
    ): Promise<Response> {
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

        return response
    }
}