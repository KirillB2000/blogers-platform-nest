import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SecurityDevices, SecurityDevicesDocument, type SercurityDevicesModelType } from "../domain/security-devices.entity.js";


@Injectable()
export class SecurityDevicesRepository {
    constructor (
        @InjectModel(SecurityDevices.name)
        private SecurityDevicesModel: SercurityDevicesModelType
    ) {}

    async save (securityDevicesDoc: SecurityDevicesDocument) {
        await securityDevicesDoc.save()
    }

    async findSession(
        issuedAtOld: number, 
        deviceId: string, 
        userId: string
    ): Promise<SecurityDevicesDocument | null> {
        const secDevDoc = await this.SecurityDevicesModel.findOne(
            {userId, deviceId, lastActiveDate: issuedAtOld}
        )

        return secDevDoc
    }
    
}