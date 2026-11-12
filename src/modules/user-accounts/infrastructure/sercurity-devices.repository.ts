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

    async delete(
        userId: string, 
        deviceId: string, 
        issuedAt: number
    ) {
        const deletedInfo = await this.SecurityDevicesModel.deleteOne (
            { userId, deviceId, lastActiveDate: issuedAt }
        )

        return deletedInfo.deletedCount > 0
    }

    async deleteOtherSessions(
        userId: string, 
        deviceId: string
    ): Promise<void> {
        await this.SecurityDevicesModel.deleteMany({
            userId: userId,
            deviceId: {$ne: deviceId}
        })
    }

    async findByDeviceId (
        deviceIdParam: string
    ): Promise<SecurityDevices | null> {
        const secDevDoc = await this.SecurityDevicesModel.findOne ({deviceId: deviceIdParam}).lean() // Check lean if tests crashed

        return secDevDoc
    }

    async deleteByDeviceId(
        deviceId: string
    ): Promise<void> {
        await this.SecurityDevicesModel.deleteOne({deviceId})
    }
    
}