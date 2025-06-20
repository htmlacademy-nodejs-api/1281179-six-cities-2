import { inject, injectable } from 'inversify';
import { Config, RestSchema } from '../../shared/libs/config/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { DatabaseClient, getMongoDBURI } from '../../shared/libs/database-client/index.js';
import { UserService } from '../../shared/modules/user/index.js';
import { UserType, Components, Cities } from '../../shared/types/index.js';
import { CityService } from '../../shared/modules/city/index.js';
import { OfferService } from '../../shared/modules/offer/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger,
    @inject(Components.RestConfig)
    private readonly config: Config<RestSchema>,
    @inject(Components.DatabaseClient)
    private readonly databaseClient: DatabaseClient,
    @inject(Components.UserService)
    private readonly userService: UserService,
    @inject(Components.CityService)
    private readonly cityService: CityService,
    @inject(Components.OfferService)
    private readonly offerService: OfferService
  ) {}

  private async initDB(): Promise<void> {
    const uri = getMongoDBURI(
      this.config.get('DB_USERNAME'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    await this.databaseClient.connect(uri);
  }

  public async init() {
    this.logger.info('Initializing the application');
    await this.initDB();
  }
}
