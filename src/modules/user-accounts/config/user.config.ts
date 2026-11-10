import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserConfig {

    constructor(
        private configService: ConfigService<any, true>
    ) {
        // for Users only

        //configValidationUtility.validateConfig(this);
    }
}