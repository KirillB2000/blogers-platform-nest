import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UserInputModel } from './inputDto/uesrs.input-dto.js';
import { AuthService } from '../application/auth.service.js';
import { RegistrationConfirmationCodeModel } from './inputDto/register-confirm-code.input-dto.js';
import { RegistrationEmailResending } from './inputDto/register-email-resending.input-dto.js';
import { LoginSuccessViewModel } from './viewDto/login-success.view-dto.js';
import { LocalAuthGuard } from '../guards/local/local-auth.guard.js';
import { ExtractUserFromRequest } from '../guards/decorators/param/extract-user-from-request.js';
import { PasswordRecoveryInputModel } from './inputDto/password-recovery.input-dto.js';
import { NewPasswordRecoveryInputModel } from './inputDto/new-password-recovery.input-dto.js';
import { UserContextDto } from '../guards/dto/user-context.dto.js';
import { AuthQueryRepository } from '../infrastructure/auth.query-repository.js';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard.js';
import { MeViewDto } from './viewDto/me.view-dto.js';

@Controller('auth')
export class AuthController {
    constructor (
        private authService: AuthService,
        private authQwRepo: AuthQueryRepository
    ) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    async login(
        @ExtractUserFromRequest() user: UserContextDto
    ): Promise<LoginSuccessViewModel> {
        const { id } = user
        return await this.authService.login(id)
    }

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

    @Post('registration-email-resending')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registrationEmailResending (
        @Body() body: RegistrationEmailResending
    ): Promise<void> {
        const { email } = body
        return await this.authService.emailResending(email)
    }

    @Post('password-recovery')
    @HttpCode(HttpStatus.NO_CONTENT)
    async passwordRecovery (
        @Body() body: PasswordRecoveryInputModel
    ) {
        const { email } = body

        return await this.authService.passwordRecovery(email)
    }

    @Post('new-password')
    @HttpCode(HttpStatus.NO_CONTENT)
    async newPassword (
        @Body() body: NewPasswordRecoveryInputModel
    ): Promise<void> {
        return await this.authService.newPassword(body)
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me (
        @ExtractUserFromRequest() user: UserContextDto
    ): Promise<MeViewDto> {
        const { id } = user
        return await this.authQwRepo.me(id)
    }
}

