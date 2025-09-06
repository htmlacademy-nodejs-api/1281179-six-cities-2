import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Middleware } from './middleware.interface.js';
import { NextFunction } from 'express';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private readonly dto: ClassConstructor<object>) {}

  public async execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      res.sendStatus(StatusCodes.BAD_REQUEST).send(errors);
    }
    return next();
  }
}
