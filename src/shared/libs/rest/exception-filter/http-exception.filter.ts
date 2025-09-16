import { StatusCodes } from 'http-status-codes';
import { HttpError } from './../errors/http-error.js';
import { Request, Response, NextFunction } from 'express';
import { ExceptionFilter } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { Logger } from '../../logger/logger.interface.js';
import { Components } from '../../../types/components.enum.js';
import { createErrorObject } from '../../../helpers/common.js';
import { ApplicationError } from '../types/application-error.enum.js';

@injectable()
export class HttpErrorExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Components.Logger) private readonly logger: Logger
  ) {}

  catch(err: Error, req: Request, res: Response, next: NextFunction): void {
    if (! (err instanceof HttpError)) {
      return next(err);
    }

    this.logger.error(`[HttpErrorException]: ${req.path} # ${err.message}`, err);

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.CommonError, err.message));
  }

}
