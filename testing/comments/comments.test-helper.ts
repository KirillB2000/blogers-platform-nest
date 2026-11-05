import { HttpStatus, INestApplication } from "@nestjs/common";
import { CommentViewModel } from "../../src/modules/bloggers-platform/comments/api/viewDto/comments.view-dto.js";
import request from 'supertest'

export class CommentsTestsHelpers {
    constructor(
        private app: INestApplication,
    ) {}

    // STATIC DTO METHODS

    // DEFAULT METHODS

    async getCommentById (
        id: string
    ): Promise<CommentViewModel> {
        const comment = await request(this.app.getHttpServer())
            .get(`/comments/${id}`)
            .expect(HttpStatus.OK)

        return comment.body as CommentViewModel
    }
}