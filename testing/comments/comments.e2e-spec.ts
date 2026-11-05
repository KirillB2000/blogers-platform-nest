import { INestApplication } from "@nestjs/common"
import { getConnectionToken } from "@nestjs/mongoose"
import { TestingModule, Test } from "@nestjs/testing"
import { Connection } from "mongoose"
import { AppModule } from "../../src/app.module.js"
import { appSetup } from "../../src/setup/app.setup.js"


describe ('Comments controller (e2e)', () => {
    let app: INestApplication
    let connection: Connection

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        appSetup(app)
        await app.init()

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
})