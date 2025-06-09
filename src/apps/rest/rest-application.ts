import { inject, injectable } from 'inversify';
import { Config, RestSchema } from '../../shared/libs/config/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { Components } from '../../shared/types/components.enum.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger,
    @inject(Components.RestConfig)
    private readonly config: Config<RestSchema>,
  ) {}

  public init() {
    this.logger.info('Rest application initialized');
    this.logger.info(`This port is ${this.config.get('PORT')}`);
  }
}
