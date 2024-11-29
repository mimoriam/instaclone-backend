import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule, {
    cors: {
      // * TODO: Add app/frontend URL to cors:
      origin: ['http://localhost:3000'],
      credentials: true,
    },
  });

  app.use(helmet());

  // ? Refers to api/v{n} where n is defined in controllers
  app.setGlobalPrefix('/api/');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      // forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.enableShutdownHooks();

  await app.listen(configService.get('PORT') || 3000);
}

bootstrap().then();
