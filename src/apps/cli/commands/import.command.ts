import { Command } from './command.interface.js';
import { TsvFileReader } from '../../../shared/libs/file-reader/tsv-file-reader.js';
import { createOffer } from '../../../shared/helpers/index.js';
import { Offer } from '../../../shared/types/index.js';
import { UserModel, DefaultUserService, UserService } from '../../../shared/modules/user/index.js';
import { OfferModel, DefaultOfferService, OfferService } from '../../../shared/modules/offer/index.js';
import { CityModel, DefaultCityService, CityService } from '../../../shared/modules/city/index.js';
import { Logger, PinoLogger } from '../../../shared/libs/logger/index.js';
import { DatabaseClient, getMongoDBURI, MongoDatabaseClient } from '../../../shared/libs/database-client/index.js';
import { DEFAULT_DB_PORT, USER_PASSWORD } from './command.constant.js';

export class ImportCommand implements Command {
  private readonly commandName = '--import';
  private userService: UserService;
  private offerService: OfferService;
  private cityService: CityService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.handleLineEvent = this.handleLineEvent.bind(this);
    this.saveOffer = this.saveOffer.bind(this);
    this.handleEndEvent = this.handleEndEvent.bind(this);
    this.logger = new PinoLogger();
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.cityService = new DefaultCityService(this.logger, CityModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return this.commandName;
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoDBURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;
    await this.databaseClient.connect(uri);

    const fileReader = new TsvFileReader(filename.trim());
    fileReader.on('line', this.handleLineEvent);
    fileReader.on('end', this.handleEndEvent);

    try {
      await fileReader.read();
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(`Can not import data from file: ${filename}`);
      console.error(`Details: ${error.message}`);
    }
  }

  private async handleLineEvent(line: string, resolve: () => void): Promise<void> {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: USER_PASSWORD
    }, this.salt);

    const city = await this.cityService.findCityByCityNameOrCreate(offer.city, {
      name: offer.city,
      coords: {
        latitude: offer.coordinates[0],
        longitude: offer.coordinates[1],
      }
    });

    await this.offerService.create({
      name: offer.name,
      description: offer.description,
      city: city.id,
      previewImage: offer.previewImage,
      photos: offer.photos,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      type: offer.type,
      roomCount: offer.roomCount,
      guestCount: offer.guestCount,
      cost: offer.cost,
      conveniences: offer.conveniences,
      author: user.id,
      coordinates: offer.coordinates,
    });
  }

  private async handleEndEvent(lineCount: string): Promise<void> {
    console.info(`${lineCount} rows imported`);
    await this.databaseClient.disconnect();
  }
}
