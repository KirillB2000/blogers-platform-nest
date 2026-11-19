import { HttpStatus, INestApplication} from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { Connection } from "mongoose"
import { App } from "supertest/types.js"
import { AppModule } from "../../src/app.module.js"
import { appSetup } from "../../src/setup/app.setup.js"
import { getConnectionToken } from "@nestjs/mongoose"
import { UserAuthTestHelper } from "./user-auth.test-helper.js"
import { EmailService } from "../../src/modules/notification/email.service.js"
import { MockInstance } from "vitest"
import { BasicAuthTest } from "../utils/basicAuthTest.js"
import { CoreConfig } from "../../src/core/core.config.js"
import { SecurityDevicesTestHelper } from "./security-devices.test-helper.js"
import request from 'supertest'

// Linked tests
describe('AuthController (e2e)', () => {
    let app: INestApplication<App>
    let connection: Connection
    let userAuthTestHelper: UserAuthTestHelper
    let securityDevicesTestHelper: SecurityDevicesTestHelper

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

        const coreModule = app.get<CoreConfig>(CoreConfig)

        userAuthTestHelper = new UserAuthTestHelper(app, new BasicAuthTest(coreModule))
        securityDevicesTestHelper = new SecurityDevicesTestHelper(app)
    })

    beforeEach (async () => {
        sendEmailMock.mockClear()
    })

    afterAll(() => {
        connection.close()
        app.close()
    })

    it('auth/registration (POST) should register user and add him to the db', async () => {


        await userAuthTestHelper.registerUserDefault(
            'TestUser',
            '123123123',
            'someEmail@example.com'
        )

        expect(sendEmailMock).toHaveBeenCalledTimes(1)
    })

    it('auth/login (POST) should login user and return access and refresh token', async () => {
        const response = await userAuthTestHelper.loginUserDefault(
            'TestUser',
            '123123123'
        )

        expect(response.body).toEqual({
            accessToken: expect.any(String)
        })
    })

    it('auth/logout (POST) should logout user and delete session', async () => {
        const list = await userAuthTestHelper.getUsersList()
        expect(list.length).toBe(1) // User from tests before

        await userAuthTestHelper.registerUserDefault(
            'TestUser2',
            '12312312344',
            'someEmail2@example.com'
        )

        const loginResponse = await userAuthTestHelper.loginUserDefault(
            'TestUser2',
            '12312312344'
        )

        const list2 = await userAuthTestHelper.getUsersList()
        expect(list2.length).toBe(2)

        const cookies = loginResponse.headers['set-cookie'] as unknown as string[]
        const refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refreshToken='))
        const refreshToken = refreshTokenCookie?.split(';')[0].split('=')[1]

        const sessionListBeforeLogout = await securityDevicesTestHelper.getDevicesList(refreshToken!)
        expect(sessionListBeforeLogout.length).toBe(1)

        await userAuthTestHelper.logout(refreshToken!)

        await request(app.getHttpServer())
            .get('/security/devices')
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HttpStatus.UNAUTHORIZED)
    })
})