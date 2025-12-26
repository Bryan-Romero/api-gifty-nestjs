import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { CustomRequest } from '../interfaces';

export const GetToken = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const token = context.switchToHttp().getRequest<CustomRequest>().get('authorization').replace('Bearer ', '').trim();

  return token || undefined;
});
