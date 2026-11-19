import { HttpCode, HttpStatus, INestApplication } from "@nestjs/common";
import { UserInputModel } from "../../src/modules/user-accounts/api/inputDto/uesrs.input-dto.js";
import request, { Response } from 'supertest'
import { LoginInputModel } from "../../src/modules/user-accounts/api/inputDto/login.input-dto.js";
import { BasicAuthTest } from "../utils/basicAuthTest.js";
import { UserViewDto } from "../../src/modules/user-accounts/api/viewDto/users.view-dto.js";
import { set } from "supertest/lib/cookies.js";

export class UserAuthTestHelper {
    constructor (
        private app: INestApplication,
        private basicAuthTest: BasicAuthTest
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

    static createUserInputDtoDefault (
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

    // INSTANCE METHODS

    async registerUserDefault (
        login: string,
        password: string,
        email: string
    ): Promise<Response> {
        const dto = UserAuthTestHelper.registerUserInputDtoDefault(login, password, email)

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
        const dto = UserAuthTestHelper.loginUserInputDtoDefault(loginOrEmail, password)

        const response = await request(this.app.getHttpServer())
            .post('/auth/login')
            .send(dto)
            .expect(HttpStatus.OK)

        return response
    }

    async logout(
        refreshToken: string
    ): Promise<void> {
        await request(this.app.getHttpServer())
            .post('/auth/logout')
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(HttpStatus.NO_CONTENT)
    }

    async createUserDefault (
        login: string,
        password: string,
        email: string
    ): Promise<UserViewDto> {
        const dto = UserAuthTestHelper.createUserInputDtoDefault(
            login,
            password,
            email
        )

        const response = await request(this.app.getHttpServer())
            .post('/users')
            .set('Authorization', this.basicAuthTest.generateBasicAuthToken())
            .send(dto)
            expect(HttpStatus.CREATED)

        return response.body as UserViewDto
    }

    async getUsersList (): Promise<UserViewDto[]> {
        const basicAuthString = this.basicAuthTest.generateBasicAuthToken()

        const userList = await request(this.app.getHttpServer())
            .get('/users')
            .set('Authorization', basicAuthString)
            .expect(HttpStatus.OK)

        return userList.body.items as UserViewDto[]
    }
}