import { UserInputModel } from "../../api/inputDto/uesrs.input-dto.js"


export class CreateUserDomainDto {
    login: string
    email: string
    passwordHash: string

    static mapToDomain(
        dto: UserInputModel, 
        passwordHash: string
    ): CreateUserDomainDto {
        return {
            email: dto.email,
            login: dto.login,
            passwordHash: passwordHash
        }
    }
}