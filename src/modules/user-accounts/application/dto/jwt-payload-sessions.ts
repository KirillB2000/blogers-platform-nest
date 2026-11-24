export class RefreshTokenPayload {
    userId: number
    deviceId: string
    jti: string
    iat: number
    exp: number
}