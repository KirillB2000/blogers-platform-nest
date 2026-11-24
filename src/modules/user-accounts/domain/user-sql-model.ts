export class UserDbRow {
    id: number
    login: string
    email: string
    password_hash: string
    created_at: Date
    updated_at: Date
    confirmation_code: string | null
    confirm_expiration_date: Date | null
    is_confirmed: boolean
    recovery_code: string | null
    recovery_expiration_date: Date | null
}

export class UserSqlModel {
    id: number
    login: string
    email: string
    passwordHash: string
    createdAt: Date
    updatedAt: Date
    emailConfirmationCode: string | null
    emailExpirationDate: Date | null
    isConfirmed: boolean
    recoveryCode: string | null
    recoveryExpirationDate: Date | null

    static mapToModel (
        row: UserDbRow
    ): UserSqlModel {
        return {
            id: row.id,
            login: row.login,
            email: row.email,
            passwordHash: row.password_hash,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            emailConfirmationCode: row.confirmation_code,
            emailExpirationDate: row.confirm_expiration_date,
            isConfirmed: row.is_confirmed,
            recoveryCode: row.recovery_code,
            recoveryExpirationDate: row.recovery_expiration_date,
        }
    }
};