import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from 'src/config/configuration.interface';

export const X_API_KEY = 'x-api-key';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<ConfigurationType>,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const apiKey = Array.isArray(request.headers[X_API_KEY])
      ? request.headers[X_API_KEY][0]
      : request.headers[X_API_KEY];

    if (!this.validApyKeyFromHeader(apiKey)) {
      throw new UnauthorizedException('Invalid API Key');
    }
    return true;
  }

  private validApyKeyFromHeader(apiKey: string | undefined): boolean {
    const api_key = this.configService.get<string>('api_key');
    return apiKey === api_key;
  }
}
