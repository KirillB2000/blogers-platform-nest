import { INestApplication } from "@nestjs/common"
import { getConnectionToken } from "@nestjs/mongoose"
import { TestingModule, Test } from "@nestjs/testing"
import { Connection } from "mongoose"
import { App } from "supertest/types.js"
import { AppModule } from "../../src/app.module.js"
import { CoreConfig } from "../../src/core/core.config.js"
import { appSetup } from "../../src/setup/app.setup.js"
import { BasicAuthTest } from "../utils/basicAuthTest.js"
import { UserAuthTestHelper } from "./user-auth.test-helper.js"
import { SecurityDevicesTestHelper } from "./security-devices.test-helper.js"

describe('SecurityDevicesController (e2e)', () => {
    let app: INestApplication<App>
    let connection: Connection
    let authTestHelper: UserAuthTestHelper
    let securityDevicesTestHelper: SecurityDevicesTestHelper

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleFixture.createNestApplication()
        appSetup(app)
        await app.init()

        connection = moduleFixture.get<Connection>(getConnectionToken())

        // Очистка всех коллекций в тестовой БД
        if (connection.db) {
            const collections = await connection.db.listCollections().toArray()

            for (const collection of collections) {
                await connection.db.collection(collection.name).deleteMany({})
            }
        }

        const coreModule = app.get<CoreConfig>(CoreConfig)

        authTestHelper = new UserAuthTestHelper(app, new BasicAuthTest(coreModule))
        securityDevicesTestHelper = new SecurityDevicesTestHelper(app)
    })

    afterAll(() => {
        connection.close()
        app.close()
    })

    it('security/devices (GET) Get devices list', async () => {
        await authTestHelper.registerUserDefault('testLogin', '123123123', 'testLogin@example.com')

        const loginResponse = await authTestHelper.loginUserDefault('testLogin', '123123123')

        const cookies = loginResponse.headers['set-cookie'] as unknown as string[]
        const refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refreshToken='))

        const refreshToken = refreshTokenCookie?.split(';')[0].split('=')[1]

        const list = await securityDevicesTestHelper.getDevicesList(refreshToken!)

        expect(list).toHaveLength(1)
    })
})