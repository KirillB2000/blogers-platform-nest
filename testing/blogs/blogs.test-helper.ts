import { HttpStatus, INestApplication } from "@nestjs/common";
import request from 'supertest'
import { BlogInputModel } from "../../src/modules/bloggers-platform/blogs/api/inputDto/blogs.input-dto.js";
import { BasicAuthTest } from "../utils/basicAuthTest.js";
import { BlogViewModel } from "../../src/modules/bloggers-platform/blogs/api/viewDto/blogs.view-dto.js";

export class BlogTestsHelpers {
    constructor (
        private app: INestApplication,
        private basicAuthTest: BasicAuthTest
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
    ): Promise<BlogViewModel> {
        const dto = BlogTestsHelpers.createBlogDtoDefault(name, description, websiteUrl)
        const basicAuthToken = this.basicAuthTest.generateBasicAuthToken()

        const response = await request(this.app.getHttpServer())
            .post('/blogs')
            .set('Authorization', basicAuthToken)
            .send(dto)
            .expect(HttpStatus.CREATED)

        return response.body as BlogViewModel
    }
}