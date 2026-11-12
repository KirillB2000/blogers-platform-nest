import { SecurityDevices } from "../../domain/security-devices.entity.js"

export class DevicesViewModel {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string

    static mapToView (
        securityDevices: SecurityDevices
    ): DevicesViewModel {
        return {
            ip: securityDevices.ip,
            title: securityDevices.title,
            lastActiveDate: new Date(securityDevices.lastActiveDate).toISOString(),
            deviceId: securityDevices.deviceId
        }
    }
} 