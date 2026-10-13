import { CreateUserDto } from "../../dto/create-user.dto.js";

export class CreateUserInputDto implements CreateUserDto {
    login: string
    email: string
    password: string
}