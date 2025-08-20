import { NextFunction } from 'express';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DocumentExist } from '../../../shared/types/document-exist.interface.js';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../../../shared/libs/rest/index.js';

export class DocumentExistMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentExist,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute({ params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    const documentExists = await this.service.exists(documentId);
    if (!documentExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${this.paramName} not found`,
        'DocumentExistMiddleware',
      );
    }

    next();
  }
}
