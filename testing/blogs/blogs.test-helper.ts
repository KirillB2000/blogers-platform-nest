import { INestApplication } from "@nestjs/common";
import request, { Response } from 'supertest'
import { BlogInputModel } from "../../src/modules/bloggers-platform/blogs/api/inputDto/blogs.input-dto.js";

export class BlogTestsHelpers {
    constructor (
        private app: INestApplication
    ) {}

    static createBlogDtoDefault(
        name: string,
        description: string,
        websiteUrl: string
    ): BlogInputModel {
        return {
            name,
            description,
            websiteUrl
        }
    }

    async createBlogDefault(
        name: string, 
        description: string,
        websiteUrl: string
    ): Promise<Response> {
        const dto = BlogTestsHelpers.createBlogDtoDefault(name, description, websiteUrl)
        const response = await request(this.app.getHttpServer())
            .post('/blogs')
            .send(dto)
            .expect(201)

        return response
    }
}