import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { IsNotEmpty, IsNumber, validateSync } from "class-validator"
import { configValidationUtility } from "../../../core/config-validation.utility.js"

@Injectable() // global config, registered in CoreModule 
export class AuthConfig {

    @IsNotEmpty({
        message: 'Set Env variable JWT_ACCESS_SECRET, using random string (OpenSSL for example)'
    })
    jwtAccessSecret: string
    
    @IsNotEmpty({
        message: 'Set Env variable JWT_REFRESH_SECRET, using random string (OpenSSL for example)'
    })
    jwtRefreshSecret: string

    @IsNumber({}, {
        message: 'Set correct number value for Env vriable JWT_ACCESS_TOKEN_EXPIRATION_AFTER_SECONDS'
    })
    jwtAccessTokenExpirationTimeInSec: number

    @IsNumber({}, {
        message: 'Set correct number value for Env vriable JWT_REFRESH_TOKEN_EXPIRATION_AFTER_SECONDS'
    })
    jwtRefreshTokenExpirationTimeInSec: number

    constructor(
        private configService: ConfigService<any, true>
    ) {

        this.jwtAccessSecret = this.configService.get('JWT_ACCESS_SECRET')
        this.jwtRefreshSecret = this.configService.get('JWT_REFRESH_SECRET')

        this.jwtAccessTokenExpirationTimeInSec = Number(this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_AFTER_SECONDS'))
        this.jwtRefreshTokenExpirationTimeInSec = Number(this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_AFTER_SECONDS'))

        configValidationUtility.validateConfig(this);
    }
}