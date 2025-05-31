import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './configuration';
import { validationSchema } from './validation';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(process.cwd(), `/.env.${process.env.NODE_ENV}`)],
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
  ],
})
export class MyConfigModule {}
