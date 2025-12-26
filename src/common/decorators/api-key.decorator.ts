import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiSecurity, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { ApiKeyGuard, X_API_KEY } from 'src/common/guards';

export const ApiKey = () =>
  applyDecorators(
    ApiSecurity(X_API_KEY),
    ApiUnauthorizedResponse({ description: 'Invalid API Key' }),
    UseGuards(ApiKeyGuard),
  );
