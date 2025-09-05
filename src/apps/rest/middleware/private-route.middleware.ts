import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../../shared/libs/rest/index.js';
import { Middleware } from './middleware.interface.js';
import { Request, Response, NextFunction } from 'express';

export class PrivateRouteMiddleware implements Middleware {
  public async execute({ tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!tokenPayload) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Token is required', 'PrivateRouteMiddleware');
    }

    return next();
  }
}
