import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './exception-filter.interface.js';
import { Components } from '../../../types/components.enum.js';
import { Logger } from '../../logger/index.js';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/index.js';

@injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger,
  ) {}

  public catch(err: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (! (err instanceof ValidationError)) {
      return next(err);
    }
  }


}
