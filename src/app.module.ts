import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

import * as Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
});

@Module({
  imports: [
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
  ],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {}
