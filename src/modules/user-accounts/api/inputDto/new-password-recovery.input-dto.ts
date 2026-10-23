import { IsString, MaxLength, MinLength } from "class-validator"
import { Trim } from "../../../../core/decorators/trim-transform.decorator.js"

export class NewPasswordRecoveryInputModel {
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @Trim()
    newPassword: string

    @IsString()
    @Trim()
    recoveryCode: string
}