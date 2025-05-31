import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigurationType } from 'src/config/configuration.interface';
import { NodeEnv } from 'src/config/node-env.enum';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService<ConfigurationType>,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    console.log(exception);
    if (this.configService.get<string>('node_env') === NodeEnv.DEVELOPMENT) {
    }

    if (exception instanceof HttpException) {
      httpAdapter.reply(
        ctx.getResponse(),
        { ...exception },
        exception.getStatus(),
      );
    } else {
      const err = new InternalServerErrorException(
        'Something went wrong on the server',
      );
      httpAdapter.reply(ctx.getResponse(), { ...err }, err.getStatus());
    }
  }
}
