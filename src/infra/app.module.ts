import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Env, envSchema } from './env/env';

import { HttpModule } from './http/controllers/http.module';
import { EnvModule } from './env/env.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }), 
    HttpModule, 
    EnvModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
