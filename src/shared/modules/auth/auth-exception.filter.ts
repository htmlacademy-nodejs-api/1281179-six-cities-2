import { inject, injectable } from 'inversify';
import { ExceptionFilter } from '../../libs/rest/exception-filter/exception-filter.interface.js';
import { NextFunction, Request, Response } from 'express';
import { BaseUserException } from './errors/base-user.exception.js';
import { Components } from '../../types/components.enum.js';
import { Logger } from '../../libs/logger/index.js';

@injectable()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger,
  ) {}

  public catch(error: Error, _req: Request, res: Response, next: NextFunction): void {
    if (! (error instanceof BaseUserException)) {
      return next(error);
    }

    this.logger.error(`[AuthExceptionFilter] ${error.message}`, error);
    res.status(error.httpStatusCode).json({type: 'AUTHORIZATION', error: error.message});
  }
}
