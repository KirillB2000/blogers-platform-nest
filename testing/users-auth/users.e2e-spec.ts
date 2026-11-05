import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { Connection } from "mongoose"
import { App } from "supertest/types.js"
import { AppModule } from "../../src/app.module.js"
import { getConnectionToken } from "@nestjs/mongoose"
import request from 'supertest';
import { appSetup } from "../../src/setup/app.setup.js"
import { BasicAuthTest } from "../utils/basicAuthTest.js"

describe('UsersController (e2e)', () => {
    let app: INestApplication<App>
    let connection: Connection
    let basicAuthTest: BasicAuthTest

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        appSetup(app)
        await app.init()

        basicAuthTest = new BasicAuthTest()

        // Подключение к БД
        connection = moduleFixture.get<Connection>(getConnectionToken())
    })

    beforeEach(async () => {
        // Очистка всех коллекций перед каждым тестом для изоляции
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

    it('/users (POST) should create user with input data', async () => {
        const response = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', basicAuthTest.generateBasicAuthToken())
            .send({
                login: 'fTestUser',
                email: 'firstTU@example.com',
                password: '123123123'
            })

        await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', basicAuthTest.generateBasicAuthToken())
            .send({
                login: 'fTestUser2',
                email: 'firstTU@example2.com',
                password: '123123123'
            })

        expect(response.status).toBe(201)
        expect(response.body.login).toBe('fTestUser')
        expect(response.body.email).toBe('firstTU@example.com')
    })

    it('/users (GET) should retrieve all users', async () => {
        // Create two users before getting them
        const res1 = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', basicAuthTest.generateBasicAuthToken())
            .send({
                login: 'fTestUser',
                email: 'firstTU@example.com',
                password: '123123123'
            })
        expect(res1.status).toBe(201)

        const res2 = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', basicAuthTest.generateBasicAuthToken())
            .send({
                login: 'fTestUser2',
                email: 'firstTU@example2.com',
                password: '123123123'
            })
        expect(res2.status).toBe(201)

        const response = await request(app.getHttpServer())
            .get('/users?pageNumber=1&pageSize=2')
            .set('Authorization', basicAuthTest.generateBasicAuthToken())

        expect(response.body.items.length).toBe(2)
        expect(response.body.totalCount).toBe(2)
        expect(response.body.pagesCount).toBe(1)

    })

    it('/users/:id (DELETE) should delete user by id', async () => {
        // Create two users before deleting
        const res1 = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', basicAuthTest.generateBasicAuthToken())
            .send({
                login: 'fTestUser',
                email: 'firstTU@example.com',
                password: '123123123'
            })
        expect(res1.status).toBe(201)

        const res2 = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', basicAuthTest.generateBasicAuthToken())
            .send({
                login: 'fTestUser2',
                email: 'firstTU@example2.com',
                password: '123123123'
            })
        expect(res2.status).toBe(201)

        const responseBeforeDelete = await request(app.getHttpServer())
            .get('/users?pageNumber=1&pageSize=2')
            .set('Authorization', basicAuthTest.generateBasicAuthToken())

        expect(responseBeforeDelete.body.items.length).toBe(2)
        expect(responseBeforeDelete.body.totalCount).toBe(2)
        expect(responseBeforeDelete.body.pagesCount).toBe(1)

        const user1Id = responseBeforeDelete.body.items[0].id
        const user2Id = responseBeforeDelete.body.items[1].id

        await request(app.getHttpServer())
            .delete(`/users/${user1Id}`)
            .set('Authorization', basicAuthTest.generateBasicAuthToken())
            .expect(204)

        await request(app.getHttpServer())
            .delete(`/users/${user2Id}`)
            .set('Authorization', basicAuthTest.generateBasicAuthToken())
            .expect(204)

        const responseAfterDelete = await request(app.getHttpServer())
            .get('/users?pageNumber=1&pageSize=2')
            .set('Authorization', basicAuthTest.generateBasicAuthToken())

        expect(responseAfterDelete.body.items.length).toBe(0)
        expect(responseAfterDelete.body.totalCount).toBe(0)
        expect(responseAfterDelete.body.pagesCount).toBe(0)

    })
})