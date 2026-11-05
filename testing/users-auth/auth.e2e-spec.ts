import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { Connection } from "mongoose"
import { App } from "supertest/types.js"
import { AppModule } from "../../src/app.module.js"
import { appSetup } from "../../src/setup/app.setup.js"
import { getConnectionToken } from "@nestjs/mongoose"
import { AuthTestHelper } from "./auth.test-helper.js"
import { EmailService } from "../../src/modules/notification/email.service.js"
import { MockInstance } from "vitest"

describe('AuthController (e2e)', () => {
    let app: INestApplication<App>
    let connection: Connection
    let authTestHelper: AuthTestHelper

    let sendEmailMock: MockInstance<EmailService['sendConfirmationEmail']>

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule ({
            imports: [AppModule]
        }).compile()

        app = moduleFixture.createNestApplication()
        appSetup(app)
        await app.init()

        const emailService = moduleFixture.get<EmailService>(EmailService)

        sendEmailMock = vi.spyOn(emailService, 'sendConfirmationEmail').mockResolvedValue(undefined)

        connection = moduleFixture.get<Connection>(getConnectionToken())

        // Очистка всех коллекций в тестовой БД
        if (connection.db) {
            const collections = await connection.db.listCollections().toArray()

            for (const collection of collections) {
                await connection.db.collection(collection.name).deleteMany({})
            }
        }

        authTestHelper = new AuthTestHelper(app)
    })

    beforeEach (async () => {
        sendEmailMock.mockClear()
    })

    afterAll(() => {
        connection.close()
        app.close()
    })

    it('auth/registration (POST) should register user and add him to the db', async () => {


        await authTestHelper.registerUserDefault(
            'TestUser',
            '123123123',
            'someEmail@example.com'
        )

        expect(sendEmailMock).toHaveBeenCalledTimes(1)
    })

    it('auth/login (POST) should login user and return access and refresh token', async () => {
        const response = await authTestHelper.loginUserDefault(
            'TestUser',
            '123123123'
        )

        expect(response.body).toEqual({
            accessToken: expect.any(String)
        })
    })
})