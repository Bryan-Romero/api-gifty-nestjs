import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';

import { Role } from '../enums';
import { JwtAuthGuard, RolesGuard } from '../guards';
import { Roles } from './roles.decorator';

export const JwtAuth = (...roles: Role[]) =>
  applyDecorators(
    ApiBearerAuth(),
    ApiForbiddenResponse({
      description: "Invalid token | You don't have privileges",
    }),
    Roles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
