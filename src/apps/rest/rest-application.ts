import { Config } from '../../shared/libs/config/index.js';
import { Logger } from '../../shared/libs/logger/index.js';

export class RestApplication {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config,
  ) {}

  public init() {
    this.logger.info('Rest application initialized');
    this.logger.info(`This port is ${this.config.get('PORT')}`);
  }
}
