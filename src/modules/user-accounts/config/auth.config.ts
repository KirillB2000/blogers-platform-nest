import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { IsNotEmpty, validateSync } from "class-validator"
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

    constructor(
        private configService: ConfigService<any, true>
    ) {

        this.jwtAccessSecret = this.configService.get('JWT_ACCESS_SECRET')
        this.jwtRefreshSecret = this.configService.get('JWT_REFRESH_SECRET')

        configValidationUtility.validateConfig(this);
    }
}