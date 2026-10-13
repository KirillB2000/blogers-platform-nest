import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { appSetup } from './setup/app.setup.js';
import { swaggerSetup } from './setup/swagger.setup.js';

export const PORT = process.env.PORT || 5005 //TODO: move to configService. will be in the following lessons
export const GLOBAL_PREFIX = process.env.GLOBAL_PREFIX || '/api' //TODO: move to configService. will be in the following lessons

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appSetup(app)
  swaggerSetup(app)

  await app.listen(process.env.PORT ?? PORT);
}
await bootstrap();