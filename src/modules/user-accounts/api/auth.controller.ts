import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserInputModel } from './inputDto/uesrs.input-dto.js';
import { AuthService } from '../application/auth.service.js';
import { RegistrationConfirmationCodeModel } from './inputDto/register-confirm-code.input-dto.js';

@Controller('auth')
export class AuthController {
    constructor (
        private authService: AuthService
    ) {}

    @Post('registration')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registerUser (
        @Body() body: UserInputModel
    ): Promise<void> {
        return await this.authService.registerUser(body)
    }

    @Post('registration-confirmation')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registrationConfirmation (
        @Body() body: RegistrationConfirmationCodeModel
    ): Promise<void> {
        const { code } = body 
        return await this.authService.emailConfirmation(code)
    }
}

