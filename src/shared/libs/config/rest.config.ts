import { Logger } from '../logger/index.js';
import { Config } from './config.interface.js';
import { config, DotenvParseOutput } from 'dotenv';

export class RestConfig implements Config {
  private readonly config: NodeJS.ProcessEnv;

  constructor(
    private readonly logger: Logger
  ){
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read env file');
    }
    this.config = <DotenvParseOutput>parsedOutput.parsed;
    this.logger.info('Env file was successfully parsed');
  }

  get(key: string): string | undefined {
    return this.config[key];
  }
}
