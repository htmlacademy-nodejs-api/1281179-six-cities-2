import { Response, Router } from 'express';
import { Controller } from './controller.interface.js';
import { Route } from '../types/route.interface.js';
import { Logger } from '../../logger/index.js';
import { StatusCodes } from 'http-status-codes';

const DEFAULT_CONTENT_TYPE = 'application/json';

export abstract class BaseController implements Controller {
  private readonly _router: Router;

  constructor(
    protected readonly logger: Logger,
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  addRoute(route: Route): void {
    const middlewares = route.middlewares?.map((middleware) => middleware.execute.bind(middleware));
    const allHandlers = middlewares ? [...middlewares, route.handler] : route.handler;
    this._router[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  send<T>(res: Response, statusCode: number, data: T, contentType = DEFAULT_CONTENT_TYPE): void {
    res
      .type(contentType)
      .status(statusCode)
      .json(data);
  }

  ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  badRequest<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.BAD_REQUEST, data);
  }

  notFound<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NOT_FOUND, data);
  }

  conflict<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CONFLICT, data);
  }

  unauthorized<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.UNAUTHORIZED, data);
  }

  forbidden<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.FORBIDDEN, data);
  }

  internalServerError<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.INTERNAL_SERVER_ERROR, data);
  }
}
