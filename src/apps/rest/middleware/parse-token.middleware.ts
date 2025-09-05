import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware.interface.js';
import { jwtVerify } from 'jose';
import { createSecretKey } from 'node:crypto';
import { TokenPayload } from '../../../shared/modules/auth/types/TokenPayload.js';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../../shared/libs/rest/index.js';

function isTokenPayload(payload: unknown): payload is TokenPayload {
  return typeof payload === 'object' && payload !== null && 'id' in payload && 'email' in payload && 'firstName' in payload && typeof payload.id === 'string' && typeof payload.email === 'string' && typeof payload.firstName === 'string';
}

export class ParseTokenMiddleware implements Middleware {
  constructor(
    private readonly token: string
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next();
    }
    const [, token] = authorizationHeader.split(' ');

    try {
      const { payload } = await jwtVerify(token, createSecretKey(this.token, 'utf-8'));

      if (isTokenPayload(payload)) {
        req.tokenPayload = {...payload};
        return next();
      } else {
        throw new Error('Invalid token payload');
      }
    } catch {
      return next(new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid token', 'AuthenticateMiddleware'));
    }

  }
}
