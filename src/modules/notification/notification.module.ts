import { Module } from '@nestjs/common';
import { EmailService } from './email.service.js';
import { MailerModule } from '@nestjs-modules/mailer'
import { EmailExamples } from './email.examples.js';
import { NotificationConfig } from './config/notification.config.js';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [NotificationModule],
      useFactory: (notificationConfig: NotificationConfig) => {
        return {
          transport: {
            service: 'gmail',
            auth: {
              user: notificationConfig.notificationEmail,
              pass: notificationConfig.notificationEmailPassword,
            }
          },

          defaults: {
            from: '"nest-modules" <modules@nestjs.com>'
          }
        }
      },

      inject: [NotificationConfig]
    })
  ],
  providers: [EmailService, EmailExamples, NotificationConfig],
  exports: [EmailService, NotificationConfig]
})
export class NotificationModule {}