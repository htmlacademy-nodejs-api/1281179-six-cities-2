import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './exception-filter.interface.js';
import { Components } from '../../../types/components.enum.js';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../../libs/logger/logger.interface.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger
  ) {}

  catch(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(`[AppExceptionFilter] ${err.message}`, err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        error: err.message,
      });
  }

}
