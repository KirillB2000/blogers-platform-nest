import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { CreateSercurityDevicesDomainDto } from "./dto/createSercurityDevicesDomainDto.js";


@Schema()
export class SecurityDevices {
    
    @Prop({
        required: true,
        type: String
    })
    userId: string

    @Prop({
        required: true,
        type: String
    })
    deviceId: string
    
    @Prop({
        required: true,
        type: Number
    })
    
    @Prop({
        required: true,
        type: Number
    })
    lastActiveDate: number // version of the refresh token
    
    @Prop({
        required: true,
        type: String,
        maxLength: 100
    })
    title: string // deviceName (need to parsing http header "user-agent")
    
    @Prop({
        required: true,
        type: String,
        maxLength: 100
    })
    ip: string
    
    @Prop({
        required: true,
        type: Date
    })
    expirationDate: Date

    static createInstance (
        dto: CreateSercurityDevicesDomainDto
    ) {
        const securityService = new this()

        securityService.deviceId = dto.deviceId
        securityService.expirationDate = dto.expirationDate
        securityService.ip = dto.ip
        securityService.lastActiveDate = dto.lastActiveDate
        securityService.title = dto.title
        securityService.userId = dto.userId

        return securityService as SecurityDevicesDocument 
    }

    updateSession(
        lasActiveDate: number,
        expirationDate: Date
    ) {
        this.lastActiveDate = lasActiveDate,
        this.expirationDate = expirationDate
    }
} 

export const SecurityDevicesSchema = SchemaFactory.createForClass(SecurityDevices)

SecurityDevicesSchema.loadClass(SecurityDevices)

SecurityDevicesSchema.index({ userId: 1, deviceId: 1, lastActiveDate: 1 })

SecurityDevicesSchema.index({deviceId: 1}, {unique: true})

export type SecurityDevicesDocument = HydratedDocument<SecurityDevices>
export type SercurityDevicesModelType = Model<SecurityDevicesDocument> & typeof SecurityDevices