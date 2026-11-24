export class SessionDbRow {
    id: number
    user_id: number
    device_id: string
    last_active_date: string // драйвер pg возвращает bigint как string
    title: string
    ip: string
    expiration_date: Date
}

export class SessionSqlModel {
    id: number;
    userId: number;
    deviceId: string;
    lastActiveDate: number;
    title: string;
    ip: string;
    expirationDate: Date;

    static mapToModel(
        row: SessionDbRow
    ): SessionSqlModel {
        return {
            id: row.id,
            userId: row.user_id,
            deviceId: row.device_id,
            lastActiveDate: Number(row.last_active_date), // приводим bigint из строки в number
            title: row.title,
            ip: row.ip,
            expirationDate: row.expiration_date,
        };
    }
}