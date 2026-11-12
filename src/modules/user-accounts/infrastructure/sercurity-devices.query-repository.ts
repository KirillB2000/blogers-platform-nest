import { Injectable } from "@nestjs/common";
import { SecurityDevices, type SercurityDevicesModelType } from "../domain/security-devices.entity.js";
import { InjectModel } from "@nestjs/mongoose";
import { DevicesViewModel } from "../api/viewDto/devices.view-dto.js";


@Injectable()
export class SecurityDevicesQueryRepository {
    constructor (
        @InjectModel(SecurityDevices.name)
        private SecurityDevicesModel: SercurityDevicesModelType
    ) {}

    async getAll (
        userId: string
    ): Promise<DevicesViewModel[]>{ 
        const secDevDocs = await this.SecurityDevicesModel.find({userId}).lean() // Check lean if TEST crushed

        const devicesList = secDevDocs.map(secDevDoc => DevicesViewModel.mapToView(secDevDoc))

        return devicesList
    }

}