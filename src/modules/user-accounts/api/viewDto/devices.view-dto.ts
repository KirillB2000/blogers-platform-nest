import { SessionDbRow } from "../../domain/sessions-model.js"

export class DevicesViewModel {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string

    static mapToView (
        sessionsDb: SessionDbRow
    ): DevicesViewModel {
        return {
            ip: sessionsDb.ip,
            title: sessionsDb.title,
            lastActiveDate: new Date(Number(sessionsDb.last_active_date)).toISOString(),
            deviceId: sessionsDb.device_id
        }
    }
}