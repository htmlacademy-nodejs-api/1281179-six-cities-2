import { Response, Router } from 'express';
import { Route } from '../types/route.interface.js';

export interface Controller {
  readonly router: Router;
  addRoute(route: Route): void;
  send<T>(res: Response, statusCode: number, data: T, contentType?: string): void;
  ok<T>(res: Response, data: T): void;
  created<T>(res: Response, data: T): void;
  noContent<T>(res: Response, data: T): void;
  badRequest<T>(res: Response, data: T): void;
  notFound<T>(res: Response, data: T): void;
  conflict<T>(res: Response, data: T): void;
  unauthorized<T>(res: Response, data: T): void;
  forbidden<T>(res: Response, data: T): void;
  internalServerError<T>(res: Response, data: T): void;
}
