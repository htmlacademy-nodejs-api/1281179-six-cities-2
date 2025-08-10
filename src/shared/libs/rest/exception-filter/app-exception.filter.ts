import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './exception-filter.interface.js';
import { Components } from '../../../types/components.enum.js';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../../libs/logger/logger.interface.js';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../errors/http-error.js';
import { createErrorObject } from '../../../helpers/common.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger
  ) {}

  catch(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof HttpError) {
      this.handleHttpError(err, _req, res, _next);
    } else {
      this.handleOtherError(err, _req, res, _next);
    }
  }

  private handleHttpError(error: HttpError, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[${error.detail}]: ${error.httpStatusCode} - ${error.message}`, error);
    res
      .status(error.httpStatusCode)
      .json(createErrorObject(error.message, error.detail));
  }

  private handleOtherError(error: Error, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(error.message));
  }
}
