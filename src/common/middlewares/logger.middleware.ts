import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
// Functional middleware
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log('Request...', req.url, req.method, req.headers);
  next();
}
