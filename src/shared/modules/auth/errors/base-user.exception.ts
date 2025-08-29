import { HttpError } from '../../../libs/rest/index.js';

export class BaseUserException extends HttpError {
  constructor(httpStatusCode: number, message: string, details?: string) {
    super(httpStatusCode, message, details);
  }
}
