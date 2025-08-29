import { inject, injectable } from 'inversify';
import { Config, RestSchema } from '../../shared/libs/config/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { DatabaseClient, getMongoDBURI } from '../../shared/libs/database-client/index.js';
import { Components } from '../../shared/types/index.js';
import express, { Express } from 'express';
import { Controller, ExceptionFilter } from '../../shared/libs/rest/index.js';

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
    @inject(Components.OfferController)
    private readonly offerController: Controller,
    @inject(Components.UserController)
    private readonly userController: Controller,
    @inject(Components.CommentController)
    private readonly commentController: Controller,
    @inject(Components.ExceptionFilter)
    private readonly exceptionFilter: ExceptionFilter,
    @inject(Components.AuthExceptionFilter)
    private readonly authExceptionFilter: ExceptionFilter,
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

  private async _initMiddleware(): Promise<void> {
    this.server.use(express.json());
    this.server.use(
      '/upload',
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
  }

  private async _initControllers(): Promise<void> {
    this.server.use('/cities', this.cityController.router);
    this.server.use('/offers', this.offerController.router);
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.commentController.router);
  }

  private async _initServer(): Promise<void> {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initExceptionFilters(): Promise<void> {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.logger.info('Initializing the application');

    await this._initDB();
    this.logger.info('DB initialized');

    await this._initMiddleware();
    this.logger.info('Middleware initialized');

    await this._initControllers();
    this.logger.info('Controllers initialized');

    await this._initExceptionFilters();
    this.logger.info('Exception filters initialized');

    await this._initServer();
    this.logger.info(`Server started on ${this.config.get('PORT')} port`);
  }
}
