import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './exception-filter.interface.js';
import { Components } from '../../../types/components.enum.js';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../../libs/logger/logger.interface.js';
import { StatusCodes } from 'http-status-codes';
import { createErrorObject } from '../../../helpers/common.js';
import { ApplicationError } from '../types/application-error.enum.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger
  ) {
    this.logger.info('Register AppExceptionFilter');
  }

  catch(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(err.message, err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ApplicationError.ServiceError, err.message));
  }

}
