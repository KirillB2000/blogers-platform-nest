import { IsString, MaxLength, MinLength } from "class-validator"

export class LoginInputModel {

    @IsString()
    loginOrEmail: string
    
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string
}