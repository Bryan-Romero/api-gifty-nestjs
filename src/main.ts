import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { X_API_KEY } from './common/guards';
import { logger } from './common/middlewares';
import { ConfigurationType } from './config/configuration.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<ConfigurationType>);
  const prefix = configService.get<string>('prefix');
  const port = configService.get<number>('port');
  const node_env = configService.get<string>('node_env');

  // Global prefix
  app.setGlobalPrefix(prefix);

  // Cors
  app.enableCors();

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        // Converts errors into one object per field
        const result = {};
        errors.forEach((error) => {
          if (error.constraints) {
            result[error.property] = Object.values(error.constraints);
          }
        });
        return new BadRequestException(result);
      },
    }),
  );

  // Middlewares
  app.use(logger);
  app.use(helmet());
  app.use(compression());

  // Swagger Module
  const config = new DocumentBuilder()
    .setTitle('Nest-Test')
    .setDescription('The Nest-Test API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: X_API_KEY, in: 'header' }, X_API_KEY)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Listen
  console.log('Environment: ', node_env);
  console.log('Server listening on port: ', port);
  await app.listen(port);
}
bootstrap();
