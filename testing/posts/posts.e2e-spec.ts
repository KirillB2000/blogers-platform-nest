import { INestApplication } from "@nestjs/common"
import { getConnectionToken } from "@nestjs/mongoose"
import { TestingModule, Test } from "@nestjs/testing"
import { Connection } from "mongoose"
import { AppModule } from "../../src/app.module.js"
import { appSetup } from "../../src/setup/app.setup.js"
import { PostTestsHelpers } from "./posts.test-helper.js"
import { BasicAuthTest } from "../utils/basicAuthTest.js"
import { BlogTestsHelpers } from "../blogs/blogs.test-helper.js"
import { LikeStatus } from "../../src/core/types/like-statuses.js"
import { UserAuthTestHelper } from "../users-auth/user-auth.test-helper.js"
import { JwtService } from "@nestjs/jwt"

describe ('Posts controller (e2e)', () => {
    let app: INestApplication
    let connection: Connection

    let postTestHelper: PostTestsHelpers
    let blogsTestHelper: BlogTestsHelpers
    let userAuthTestHelper: UserAuthTestHelper
    let jwtService: JwtService

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        appSetup(app)
        await app.init()

        jwtService = app.get<JwtService>(JwtService)

        postTestHelper = new PostTestsHelpers(app, new BasicAuthTest())
        blogsTestHelper = new BlogTestsHelpers(app, new BasicAuthTest())
        userAuthTestHelper = new UserAuthTestHelper(app, new BasicAuthTest())

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

    afterAll(async () => {
        app.close()
    })

    it('/posts (POST) should create post with correct input data', async () => {

        const blog = await blogsTestHelper.createBlogDefault(
            'blogName',
            'some blog descroption',
            'https://www.someSite.com'
        )

        const response = await postTestHelper.createPostDefault(
            'testTitle',
            'testShortDescr',
            'testConetent',
            blog.id
        )

        expect(response).toEqual({
            id: expect.any(String),
            title: "testTitle",
            shortDescription: "testShortDescr",
            content: "testConetent",
            blogId: blog.id,
            blogName: blog.name,
            createdAt: expect.any(String),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None,
                newestLikes: []
            }
        });
    })

    it ('/posts/${postId}/comments (POST) Should create new comment for specific post', async () => {
        const user = await userAuthTestHelper.createUserDefault(
            'tComLogin',
            '123123123',
            'tComLogin@example.com'
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

        const token = jwtService.sign(
            {sub: user.id},
            {
                secret: process.env.JWT_ACCESS_SECRET || 'fallback-access-secret',
                expiresIn: '5m'
            }
        )

        const comment = await postTestHelper.createCommentForPostDefault (
            'testContenttestContenttestContenttestContent',
            post.id,
            token
        )

        expect(comment).toEqual({
            id: expect.any(String),
            content: expect.any(String),
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: comment.likesInfo.myStatus
            }
        })

    })
})