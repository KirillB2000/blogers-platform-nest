import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { appSetup } from './setup/app.setup.js';
import { swaggerSetup } from './setup/swagger.setup.js';
import { CoreConfig } from './core/core.config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const coreConfig = app.get<CoreConfig>(CoreConfig)

  if (coreConfig.isSwaggerEnabled) {
    swaggerSetup(app)  
  }

  appSetup(app)

  await app.listen(coreConfig.port);
}
await bootstrap(); 