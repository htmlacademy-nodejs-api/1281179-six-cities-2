import { Request, Response, NextFunction } from 'express';

export interface ExceptionFilter {
  catch(err: Error, _req: Request, res: Response, _next: NextFunction): void;
}
