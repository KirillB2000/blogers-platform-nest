export class CreateSercurityDevicesDomainDto {
    userId: string
    deviceId: string
    lastActiveDate: number // version of the refresh token
    title: string // deviceName (need to parsing http header "user-agent")
    ip: string
    expirationDate: Date


    static mapToDomain (
        userId: string,
        deviceId: string,
        lastActiveDate: number, 
        title: string, 
        ip: string,
        expirationDate: Date
    ): CreateSercurityDevicesDomainDto {
        return {
            userId,
            deviceId,
            lastActiveDate,
            title,
            ip,
            expirationDate
        }
    }
}