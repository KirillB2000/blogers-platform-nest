import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsEmail, IsNotEmpty, validateSync } from "class-validator";
import { configValidationUtility } from "../../../core/config-validation.utility.js";

@Injectable()
export class NotificationConfig {
    
    @IsEmail({}, {
        message: 'Set correct Env variable NOTIFICATION_EMAIL'
    })
    @IsNotEmpty({
        message: 'Set Env variable NOTIFICATION_EMAIL'
    })
    notificationEmail: string

    @IsNotEmpty({
        message: 'Set Env variable NOTIFICATION_EMAIL_PASSWORD'
    })
    notificationEmailPassword: string

    constructor (
        private configService: ConfigService<any, true>
    ) {
        this.notificationEmail = this.configService.get('NOTIFICATION_EMAIL')
        this.notificationEmailPassword = this.configService.get('NOTIFICATION_EMAIL_PASSWORD')

        configValidationUtility.validateConfig(this);
    }
}