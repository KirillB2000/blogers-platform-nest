import { Global, Module } from '@nestjs/common';
import { CoreConfig } from './core.config.js';
import { AuthConfig } from '../modules/user-accounts/config/auth.config.js';

@Global()
@Module({
    providers: [CoreConfig, AuthConfig],
    exports: [CoreConfig, AuthConfig]
})

export class CoreModule {}
