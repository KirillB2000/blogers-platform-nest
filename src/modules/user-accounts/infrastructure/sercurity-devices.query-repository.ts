import { Injectable } from "@nestjs/common";
import { DevicesViewModel } from "../api/viewDto/devices.view-dto.js";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { SessionDbRow } from "../domain/sessions-model.js";


@Injectable()
export class SecurityDevicesQueryRepository {
    constructor (
        @InjectDataSource()
        private dataSource: DataSource
    ) {}

    async getAll (
        userId: number
    ): Promise<DevicesViewModel[]> { 
        const sessionsDbRows: SessionDbRow[] = await this.dataSource.query(
            `
                SELECT *
                FROM sessions
                WHERE user_id=$1
            `,
            [userId]
        )

        const DevicesVM = sessionsDbRows.map(sessionDbRow => DevicesViewModel.mapToView(sessionDbRow))

        return DevicesVM
    }

}