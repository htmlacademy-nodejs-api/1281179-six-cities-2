import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../../shared/libs/rest/index.js';
import { ObjectId } from 'mongodb';

export class ValidateObjectIdMiddleware implements Middleware {

  constructor(private readonly param: string) {}
  execute(req: Request, _res: Response, next: NextFunction): void {
    const objectId = req.params[this.param];
    if (ObjectId.isValid(objectId)) {
      return next();
    }
    throw new HttpError(StatusCodes.BAD_REQUEST, `${objectId} is not valid ObjectId`);
  }

}
