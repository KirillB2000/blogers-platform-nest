import { IsEmail, IsString, MinLength } from "class-validator";
import { CreateUserDto } from "../../dto/create-user.dto.js";

export class CreateUserInputDto implements CreateUserDto {
    
    @IsString()
    @MinLength(0)
    login: string

    @IsEmail()
    email: string

    @IsString()
    password: string
}