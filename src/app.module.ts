import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PostsModule } from './posts/posts.module';

import * as Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  REDIS_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().uri().required(),
  JWT_TOKEN_ISSUER: Joi.string().uri().required(),
  // 15 mins:
  JWT_ACCESS_TOKEN_TTL: Joi.number().default(900),
  // 24 hours:
  JWT_REFRESH_TOKEN_TTL: Joi.number().default(86400),
  TFA_APP_NAME: Joi.string().required(),
});

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 10 * 60 * 1000, // 10 mins
        limit: 100,
      },
    ]),
    ConfigModule.forRoot({
      envFilePath: ['.env.local'],
      validationSchema: envSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },

      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),

    UsersModule,
    IamModule,
    PostsModule,
  ],
  controllers: [],
  providers: [
    // Provide throttle globally:
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [ConfigModule],
})
export class AppModule {}
