import { IsString } from "class-validator";
import { Trim } from "../../../../core/decorators/trim-transform.decorator.js";

export class RegistrationConfirmationCodeModel {
    @IsString()
    @Trim()
    code: string
}