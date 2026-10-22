import { UserDocument } from "../../domain/user.entity.js"

export class MeViewDto {
    email: string
    login: string
    userId: string

    static mapToView (
        userDocument: UserDocument
    ): MeViewDto {
        return {
            email: userDocument.email,
            login: userDocument.login,
            userId: userDocument._id.toString()
        }
    }
}