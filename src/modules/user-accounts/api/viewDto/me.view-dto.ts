import { UserDbRow } from "../../domain/user-sql-model.js"

export class MeViewDto {
    email: string
    login: string
    userId: string

    static mapToView (
        userDbRow: UserDbRow
    ): MeViewDto {
        return {
            email: userDbRow.email,
            login: userDbRow.login,
            userId: userDbRow.id.toString()
        }
    }
}