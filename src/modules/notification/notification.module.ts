import { Module } from '@nestjs/common';
import { EmailService } from './email.service.js';
import { MailerModule } from '@nestjs-modules/mailer'
import { SETTINGS } from '../../settings.js';
import { EmailExamples } from './email.examples.js';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: SETTINGS.EMAIL,
          pass: SETTINGS.EMAIL_PASSWORD,
        }
      },

      defaults: {
        from: '"nest-modules" <modules@nestjs.com>'
      }
    })
  ],
  providers: [EmailService, EmailExamples],
  exports: [EmailService]
})
export class NotificationModule {}
