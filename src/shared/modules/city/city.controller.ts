import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/components.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { HttpMethod } from '../../libs/rest/index.js';
import { Request, Response } from 'express';

@injectable()
export class CityController extends BaseController {
  constructor(
    @inject(Components.Logger)
    protected readonly logger: Logger,
  ) {
    super(logger);
    this.logger.info('Register routes for CityController');
    this.addRoute({
      path: '/',
      method: HttpMethod.GET,
      handler: this.index,
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.POST,
      handler: this.create,
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    this.ok(res, 'index');
  }

  public async create(_req: Request, res: Response): Promise<void> {
    this.created(res, 'create');
  }
}
