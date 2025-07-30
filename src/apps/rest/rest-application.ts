import { inject, injectable } from 'inversify';
import { Config, RestSchema } from '../../shared/libs/config/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { DatabaseClient, getMongoDBURI } from '../../shared/libs/database-client/index.js';
import { Components } from '../../shared/types/index.js';
import express, { Express } from 'express';
import { Controller } from '../../shared/libs/rest/index.js';

@injectable()
export class RestApplication {
  private readonly server: Express;
  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger,
    @inject(Components.RestConfig)
    private readonly config: Config<RestSchema>,
    @inject(Components.DatabaseClient)
    private readonly databaseClient: DatabaseClient,
    @inject(Components.CityController)
    private readonly cityController: Controller,
  ) {
    this.server = express();
  }

  private async _initDB(): Promise<void> {
    const uri = getMongoDBURI(
      this.config.get('DB_USERNAME'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    await this.databaseClient.connect(uri);
  }

  private async _initControllers(): Promise<void> {
    this.server.use('/cities', this.cityController.router);
  }

  private async _initServer(): Promise<void> {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  public async init() {
    this.logger.info('Initializing the application');
    await this._initDB();
    this.logger.info('DB initialized');
    this.logger.info('Try to init server...');
    await this._initControllers();
    this.logger.info('Controllers initialized');
    await this._initServer();
    this.logger.info(`Server started on ${this.config.get('PORT')} port`);
  }
}

