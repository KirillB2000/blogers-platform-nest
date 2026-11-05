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

describe ('Posts controller (e2e)', () => {
    let app: INestApplication
    let connection: Connection
    let postTestHelper: PostTestsHelpers
    let blogsTestHelper: BlogTestsHelpers

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        appSetup(app)
        await app.init()

        postTestHelper = new PostTestsHelpers(app, new BasicAuthTest())
        blogsTestHelper = new BlogTestsHelpers(app, new BasicAuthTest())

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
            blog.body.id
        )

        expect(response.body).toEqual({
            id: expect.any(String),
            title: "testTitle",
            shortDescription: "testShortDescr",
            content: "testConetent",
            blogId: blog.body.id,
            blogName: blog.body.name,
            createdAt: expect.any(String),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None,
                newestLikes: []
            }
        });
    })
})