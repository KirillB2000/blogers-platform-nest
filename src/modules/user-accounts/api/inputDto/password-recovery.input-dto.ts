import { IsString, Matches } from "class-validator";
import { Trim } from "../../../../core/decorators/trim-transform.decorator.js";

export class PasswordRecoveryInputModel {
    @IsString()
    @Matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    @Trim()
    email: string
}