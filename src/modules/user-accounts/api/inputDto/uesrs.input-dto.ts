import { IsEmail, Matches } from "class-validator";
import { CreateUserDto } from "../../dto/create-user.dto.js";
import { Trim } from "../../../../core/decorators/trim-transform.decorator.js";
import { IsStringWithTrim } from "../../../../core/decorators/trim-and-string-validate.decorators.js";
import { loginConstraints, passwordConstraints } from "../../domain/user.entity.js";

export class UserInputModel implements CreateUserDto {
    
    @IsStringWithTrim(loginConstraints.minLength, loginConstraints.maxLength)
    @Matches(/^[a-zA-Z0-9_-]*$/)
    login: string

    @IsStringWithTrim(passwordConstraints.minLength, passwordConstraints.maxLength)
    password: string

    @IsEmail()
    @Matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    @Trim()
    email: string
}