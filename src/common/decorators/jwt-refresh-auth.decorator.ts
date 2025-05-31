import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { JwtRefreshAuthGuard } from '../guards';

export const JwtRefreshAuth = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiForbiddenResponse({ description: 'Invalid token' }),
    UseGuards(JwtRefreshAuthGuard),
  );
