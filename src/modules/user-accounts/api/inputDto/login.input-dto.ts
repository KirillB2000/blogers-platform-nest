import { IsString, MaxLength, MinLength } from "class-validator"
import { Trim } from "../../../../core/decorators/trim-transform.decorator.js"

export class LoginInputModel {

    @IsString()
    @Trim()
    loginOrEmail: string
    
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @Trim()
    password: string
}