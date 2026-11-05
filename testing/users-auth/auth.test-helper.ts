import { HttpCode, HttpStatus, INestApplication } from "@nestjs/common";
import { UserInputModel } from "../../src/modules/user-accounts/api/inputDto/uesrs.input-dto.js";
import request, { Response } from 'supertest'
import { LoginInputModel } from "../../src/modules/user-accounts/api/inputDto/login.input-dto.js";


export class AuthTestHelper {
    constructor (
        private app: INestApplication
    ) {}

    // STATIC DTO METHODS
    
    static registerUserInputDtoDefault (
        login: string,
        password: string,
        email: string
    ): UserInputModel {
        return {
            login,
            password,
            email
        }
    }

    static loginUserInputDtoDefault (
        loginOrEmail: string,
        password: string
    ): LoginInputModel {
        return {
            loginOrEmail,
            password
        }
    }

    // INSTANCE METHODS

    async registerUserDefault (
        login: string,
        password: string,
        email: string
    ): Promise<Response> {
        const dto = AuthTestHelper.registerUserInputDtoDefault(login, password, email)

        const response = await request(this.app.getHttpServer())
            .post('/auth/registration')
            .send(dto)
            .expect(HttpStatus.NO_CONTENT)

        return response
    }

    async loginUserDefault (
        loginOrEmail: string,
        password: string
    ): Promise<Response> {
        const dto = AuthTestHelper.loginUserInputDtoDefault(loginOrEmail, password)

        const response = await request(this.app.getHttpServer())
            .post('/auth/login')
            .send(dto)
            .expect(HttpStatus.OK)

        return response
    }
}