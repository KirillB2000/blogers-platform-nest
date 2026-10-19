import { INestApplication } from "@nestjs/common"
import { getConnectionToken } from "@nestjs/mongoose"
import { TestingModule, Test } from "@nestjs/testing"
import { Connection } from "mongoose"
import { AppModule } from "../../src/app.module.js"
import { appSetup } from "../../src/setup/app.setup.js"
import request from 'supertest'
import { BlogTestsHelpers } from "./blogs.test-helper.js"


describe ('Blogs controller (e2e)', () => {
    let app: INestApplication
    let connection: Connection
    let blogTestsHelper: BlogTestsHelpers

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        appSetup(app)
        await app.init()

        blogTestsHelper = new BlogTestsHelpers(app)

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

    it('/blogs (POST) should create blog with correct input data', async () => {
        const response = await blogTestsHelper.createBlogDefault(
            'blogName',
            'some blog descroption',
            'www.someSite.com'
        )

        expect(response.body.name).toBe('blogName')
    })
})