import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { CreateUserDto } from "../../dto/create-user.dto.js";

export class UserInputModel implements CreateUserDto {
    
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    @Matches(/^[a-zA-Z0-9_-]*$/)
    login: string

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string

    @IsEmail()
    @Matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    email: string
}