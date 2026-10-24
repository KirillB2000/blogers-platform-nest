import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailExamples } from './email.examples.js';

@Injectable()
export class EmailService {
    constructor(
        private mailerService: MailerService,
        private emailExamples: EmailExamples
    ) {}

    async sendConfirmationEmail (
        email: string,
        code: string
    ): Promise<void> {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Registration Confirmation',
            html: this.emailExamples.registrationEmail(code)
        })
    }

    async sendRecoveryPassword (
        email: string,
        code: string
    ): Promise<void> {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Password Recovery',
            html: this.emailExamples.recoveryPasswordEmail(code)
        })
    }
}
