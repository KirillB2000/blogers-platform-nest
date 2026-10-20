import { Module } from '@nestjs/common';
import { EmailService } from './email.service.js';
import { MailerModule } from '@nestjs-modules/mailer'
import { SETTINGS } from '../../settings.js';

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
  providers: [EmailService],
  exports: [EmailService]
})
export class NotificationModule {}
