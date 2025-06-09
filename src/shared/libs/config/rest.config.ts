import { Logger } from '../logger/index.js';
import { Config } from './config.interface.js';
import { config } from 'dotenv';
import { configRestSchema, RestSchema } from './rest.schema.js';
import { injectable, inject } from 'inversify';
import { Components } from '../../types/components.enum.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger
  ){
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read env file');
    }

    configRestSchema.load({});
    configRestSchema.validate({
      allowed: 'strict',
      output: this.logger.info
    });
    this.config = configRestSchema.getProperties();
    this.logger.info('Env file was successfully parsed');
  }

  get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
