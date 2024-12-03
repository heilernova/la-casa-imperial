/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  if (process.env.NODE_ENV == "development"){
    app.enableCors();
  } else {
    app.enableCors({
      origin: [
        "https://panel.lacasaimperial.com",
        "https://www.lacasaimperial.com"
      ]
    });
  }
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`
  );
}

bootstrap();
