import { HttpStatus, INestApplication } from "@nestjs/common";
import { DevicesViewModel } from "../../src/modules/user-accounts/api/viewDto/devices.view-dto.js";
import request, { Response } from 'supertest'


export class SecurityDevicesTestHelper {
    constructor(
        private app: INestApplication,
    ) {}


    async getDevicesList (
        refreshToken: string
    ): Promise<DevicesViewModel[]> {
        const response = await request(this.app.getHttpServer())
            .get('/security/devices')
            .set('Cookie',  `refreshToken=${refreshToken}`)

        return response.body as DevicesViewModel[]
    }
}