import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SecurityDevices, SecurityDevicesDocument, type SercurityDevicesModelType } from "../domain/security-devices.entity.js";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { SessionDbRow, SessionSqlModel } from "../domain/sessions-model.js";


@Injectable()
export class SecurityDevicesRepository {

    constructor (
        @InjectModel(SecurityDevices.name)
        private SecurityDevicesModel: SercurityDevicesModelType,
        @InjectDataSource() 
        private dataSource: DataSource
    ) {}

    async save (securityDevicesDoc: SecurityDevicesDocument) {
        await securityDevicesDoc.save()
    }

    async createSession (
        userId: number,
        deviceId: string,
        lastActiveDate: number,
        title: string,
        ipAddress: string,
        expirationDate: Date
    ): Promise<void> {
        await this.dataSource.query(
            `
                INSERT INTO public.sessions(
	                user_id, device_id, last_active_date, title, ip, expiration_date)
	                VALUES ($1, $2, $3, $4, $5, $6);
            `,
            [userId, deviceId, lastActiveDate, title, ipAddress, expirationDate]
        )
    }

    async findSession(
        issuedAt: number, 
        deviceId: string, 
        userId: number
    ): Promise<SessionSqlModel | null> {
        const sessionsRows: SessionDbRow[] = await this.dataSource.query(
            `
                SELECT *
                FROM sessions
                WHERE last_active_date=$1 AND device_id=$2 AND user_id=$3
            `,
            [issuedAt, deviceId, userId]
        )

        const sessionRow = sessionsRows[0] ? sessionsRows[0] : null
        
        return sessionRow ? SessionSqlModel.mapToModel(sessionRow) : null
    }

    async delete(
        userId: number, 
        deviceId: string, 
        issuedAt: number
    ): Promise<boolean> {
        // const deletedInfo = await this.SecurityDevicesModel.deleteOne (
        //     { userId, deviceId, lastActiveDate: issuedAt }
        // )

        // return deletedInfo.deletedCount > 0

        const [, deletedCount] = await this.dataSource.query(
            `
                DELETE FROM sessions
                WHERE user_id=$1 AND device_id=$2 AND last_active_date=$3
            `,
            [userId, deviceId, issuedAt]
        )

        return deletedCount > 0
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

    async updateSession(
        id: number,
        issuedAt: number, 
        expiredAt: Date
    ): Promise<void> {
        await this.dataSource.query(
            `
                UPDATE sessions
                SET last_active_date=$2,
                    expiration_date=$3
                WHERE id=$1
            `,
            [id, issuedAt, expiredAt]
        )
    }
}