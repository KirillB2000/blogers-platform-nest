import { HttpStatus, INestApplication } from "@nestjs/common"
import { getConnectionToken } from "@nestjs/mongoose"
import { TestingModule, Test } from "@nestjs/testing"
import { Connection } from "mongoose"
import { AppModule } from "../../src/app.module.js"
import { appSetup } from "../../src/setup/app.setup.js"
import { JwtService } from "@nestjs/jwt"
import { UserAuthTestHelper } from "../users-auth/user-auth.test-helper.js"
import { BasicAuthTest } from "../utils/basicAuthTest.js"
import { BlogTestsHelpers } from "../blogs/blogs.test-helper.js"
import { PostTestsHelpers } from "../posts/posts.test-helper.js"
import request from 'supertest'

describe ('Comments controller (e2e)', () => {
    let app: INestApplication
    let connection: Connection
    let jwtService: JwtService
    let userAuthTestHelper: UserAuthTestHelper
    let blogsTestHelper: BlogTestsHelpers
    let postTestHelper: PostTestsHelpers

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        appSetup(app)
        await app.init()

        jwtService = app.get<JwtService>(JwtService)
        userAuthTestHelper = new UserAuthTestHelper(app, new BasicAuthTest())
        blogsTestHelper = new BlogTestsHelpers(app, new BasicAuthTest())
        postTestHelper = new PostTestsHelpers(app, new BasicAuthTest())

        // Подключение к БД
        connection = moduleFixture.get<Connection>(getConnectionToken())

        // Очистка всех коллекций в тестовой БД
        if (connection.db) {
            const collections = await connection.db.listCollections().toArray()

            for (const collection of collections) {
                await connection.db.collection(collection.name).deleteMany({})
            }
        }
    })

    beforeEach(async () => {
        if (connection.db) {
            const collections = await connection.db.listCollections().toArray()

            for (const collection of collections) {
                await connection.db.collection(collection.name).deleteMany({})
            }
        }
    })

    afterAll(async () => {
        await app.close()
        await connection.close()
    })

    it('/comments/:commentId (PUT) should not update existing post with 403 exception', async () => {
        const user1 = await userAuthTestHelper.createUserDefault(
            'tComLogin',
            '123123123',
            'tComLogin@example.com'
        )

        const user2 = await userAuthTestHelper.createUserDefault(
            'tComLogin2',
            '123123123',
            'tComLogin2@example.com'
        )

        const blog = await blogsTestHelper.createBlogDefault(
            'blogName',
            'some blog descroption',
            'https://www.someSite.com'
        )

        const post = await postTestHelper.createPostDefault(
            'testTitle',
            'testShortDescr',
            'testContent',
            blog.id
        )

        const tokenUsr1 = jwtService.sign(
            { sub: user1.id },
            {
                secret: process.env.JWT_ACCESS_SECRET || 'fallback-access-secret',
                expiresIn: '5m'
            }
        )

        const tokenUsr2 = jwtService.sign(
            { sub: user2.id },
            {
                secret: process.env.JWT_ACCESS_SECRET || 'fallback-access-secret',
                expiresIn: '5m'
            }
        )

        const commentOfFirstUser = await postTestHelper.createCommentForPostDefault(
            'testContenttestContenttestContenttestContent',
            post.id,
            tokenUsr1
        )

        await request(app.getHttpServer())
            .put(`/comments/${commentOfFirstUser.id}`)
            .set('Authorization', `Bearer ${tokenUsr2}`)
            .send({
                content: 'NewtestContenttestContenttestContenttestContentNew'
            })
            .expect(HttpStatus.FORBIDDEN)
    })

    it('/comments/:commentId (DELETE) should not delete existing post with 403 exception', async () => {
        
        const user1 = await userAuthTestHelper.createUserDefault(
            'tComLogin',
            '123123123',
            'tComLogin@example.com'
        )

        const user2 = await userAuthTestHelper.createUserDefault(
            'tComLogin2',
            '123123123',
            'tComLogin2@example.com'
        )

        const blog = await blogsTestHelper.createBlogDefault(
            'blogName',
            'some blog descroption',
            'https://www.someSite.com'
        )

        const post = await postTestHelper.createPostDefault(
            'testTitle',
            'testShortDescr',
            'testContent',
            blog.id
        )

        const tokenUsr1 = jwtService.sign(
            { sub: user1.id },
            {
                secret: process.env.JWT_ACCESS_SECRET || 'fallback-access-secret',
                expiresIn: '5m'
            }
        )

        const tokenUsr2 = jwtService.sign(
            { sub: user2.id },
            {
                secret: process.env.JWT_ACCESS_SECRET || 'fallback-access-secret',
                expiresIn: '5m'
            }
        );

        const commentOfFirstUser = await postTestHelper.createCommentForPostDefault(
            'testContenttestContenttestContenttestContent',
            post.id,
            tokenUsr1
        )

        await request(app.getHttpServer())
            .delete(`/comments/${commentOfFirstUser.id}`)
            .set('Authorization', `Bearer ${tokenUsr2}`)
            .expect(HttpStatus.FORBIDDEN)
    })

    it('/comments/:commentId/like-status (PUT) make likes and dislikes operations', async () => {
        
    })
})