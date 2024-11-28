import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import * as Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().port().default(3000).required(),
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
  ],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {}
