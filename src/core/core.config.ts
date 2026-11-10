import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsEnum, IsNotEmpty, IsNumber, IsString, validateSync } from "class-validator";
import { configValidationUtility } from "./config-validation.utility.js";

export enum Environments {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
    TESTING = 'testing'
}

@Injectable()
export class CoreConfig {

    @IsNumber(
        {},
        {
            message: 'Set Env variable PORT, example: 3000'
        }
    )
    port: number;

    @IsNotEmpty({
        message: 'Set Env variable MONGODB_URI'
    })
    mongoURI: string

    @IsNotEmpty({
        message: 'Set Env variable ADMIN_USERNAME'
    })
    adminUsername: string

    @IsNotEmpty({
        message: 'Set Env variable ADMIN_PASSWORD'
    })
    adminPassword: string
    
    @IsEnum(
        Environments,
        {
            message: 'Should be fullfilled by value from terminal command'
        }
    )
    env: string

    @IsNotEmpty({
        message: 'Set Env variable IS_SWAGGER_ENABLED, should FALSE in production'
    })
    isSwaggerEnabled: boolean | null

    constructor(
        private configService: ConfigService<any, true>
    ) {
        this.mongoURI = this.configService.get('MONGODB_URI')
        this.port = Number(this.configService.get('PORT'))
        this.adminUsername = this.configService.get('ADMIN_USERNAME')
        this.adminPassword = this.configService.get('ADMIN_PASSWORD')
        this.env = this.configService.get('NODE_ENV')

        this.isSwaggerEnabled = configValidationUtility.convertToBoolean(this.configService.get('IS_SWAGGER_ENABLED'))


        configValidationUtility.validateConfig(this);
    }
}