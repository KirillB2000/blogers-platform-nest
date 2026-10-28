import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginSuccessViewModel } from "../../api/viewDto/login-success.view-dto.js";
import { JwtService } from "@nestjs/jwt";

export class LoginUserCommand {
    constructor (
        public userId: string
    ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand, LoginSuccessViewModel>{
    
    constructor (
        private jwtService: JwtService
    ) {

    }
    
    async execute(
        command: LoginUserCommand
    ): Promise<LoginSuccessViewModel> {
        const { userId } = command

        const payload = { sub: userId }
        const accessToken = this.jwtService.sign(payload)

        return { accessToken }
    }
}