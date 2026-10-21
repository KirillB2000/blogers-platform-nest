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
        code: string,
        email: string
    ): Promise<void> {
        await this.mailerService.sendMail({
            text: this.emailExamples.registrationEmail(code)
        })
    }

    async sendRecoveryPassword (
        code: string,
        email: string
    ): Promise<void> {
        await this.mailerService.sendMail({
            text: this.emailExamples.recoveryPasswordEmail(code)
        })
    }
}
