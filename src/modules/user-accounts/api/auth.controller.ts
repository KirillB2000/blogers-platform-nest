import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { UserInputModel } from './inputDto/uesrs.input-dto.js';
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
import { ThrottlerGuard } from '@nestjs/throttler';
import { CommandBus } from '@nestjs/cqrs';
import { LoginUserCommand } from '../application/usecases/login-user.usecase.js';
import { RegisterUserCommand } from '../application/usecases/register-user.usecase.js';
import { EmailConfirmationCommand } from '../application/usecases/email-conifrmation.usecase.js';
import { EmailResendingCommand } from '../application/usecases/email-resending.usecase.js';
import { PasswordRecoveryCommand } from '../application/usecases/password-recovery.usecase.js';
import { UpdatePasswordCommand } from '../application/usecases/update-password.usecase.js';
import { type Response } from 'express';
import { TokensCredsAppDto } from '../application/dto/tokens-creds.app.dto.js';

@Controller('auth')
export class AuthController {
    constructor (
        private authQwRepo: AuthQueryRepository,
        private commandBus: CommandBus
    ) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    async login(
        @ExtractUserFromRequest() user: UserContextDto,
        @Res({passthrough: true}) res: Response
    ): Promise<LoginSuccessViewModel> {
        const { accessToken, refreshToken } = await this.commandBus.execute<LoginUserCommand, TokensCredsAppDto>(new LoginUserCommand(user.id))

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })

        return { accessToken }
    }

    @UseGuards(ThrottlerGuard)
    @Post('registration')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registerUser (
        @Body() body: UserInputModel
    ): Promise<void> {
        return await this.commandBus.execute<RegisterUserCommand, void>(new RegisterUserCommand({...body}))
    }

    @UseGuards(ThrottlerGuard)
    @Post('registration-confirmation')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registrationConfirmation (
        @Body() body: RegistrationConfirmationCodeModel
    ): Promise<void> {
        const { code } = body 
        return await this.commandBus.execute<EmailConfirmationCommand, void>(new EmailConfirmationCommand(code))
    }

    @UseGuards(ThrottlerGuard)
    @Post('registration-email-resending')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registrationEmailResending (
        @Body() body: RegistrationEmailResending
    ): Promise<void> {
        const { email } = body
        return await this.commandBus.execute<EmailResendingCommand, void>(new EmailResendingCommand(email))
    }

    @UseGuards(ThrottlerGuard)
    @Post('password-recovery')
    @HttpCode(HttpStatus.NO_CONTENT)
    async passwordRecovery (
        @Body() body: PasswordRecoveryInputModel
    ) {
        const { email } = body

        return await this.commandBus.execute<PasswordRecoveryCommand, void>(new PasswordRecoveryCommand(email))
    }

    @UseGuards(ThrottlerGuard)
    @Post('new-password')
    @HttpCode(HttpStatus.NO_CONTENT)
    async newPassword (
        @Body() body: NewPasswordRecoveryInputModel
    ): Promise<void> {
        return await this.commandBus.execute<UpdatePasswordCommand, void>(new UpdatePasswordCommand({...body}))
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

