import { IsString } from "class-validator";

export class LoginSuccessViewModel {
    @IsString()
    accessToken: string
}