import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './exception-filter.interface.js';
import { Components } from '../../../types/components.enum.js';
import { Logger } from '../../logger/index.js';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/index.js';
import { createErrorObject } from '../../../helpers/common.js';
import { ApplicationError } from '../types/application-error.enum.js';

@injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger,
  ) {
    this.logger.info('Register ValidationExceptionFilter');
  }

  public catch(err: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (! (err instanceof ValidationError)) {
      return next(err);
    }

    this.logger.error(`[ValidationException]: ${err.message}`, err);

    err.details.forEach(
      (errField) => this.logger.warn(`[${errField.property}] - ${errField.messages}`)
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.ValidationError, err.message, err.details));
  }
}
