import {Command} from './command.interface.js';
import {
  City,
  Conveniences,
  MockServerDataRequestType,
  OffersRequestType,
  PropertyType,
  UserByIdRequestType
} from '../../shared/types/index.js';
import {TsvOfferGenerator} from '../../shared/libs/offer-generator/index.js';
import {TsvFileWriter} from '../../shared/libs/file-writer/index.js';
import {fetchJSON} from '../../shared/libs/api/index.js';

export class GenerateCommand implements Command {
  private initialData?: MockServerDataRequestType;
  private readonly name = '--generate';

  public getName(): string {
    return this.name;
  }

  public async load(url: string) {
    try {
      this.initialData = await Promise.all([
        fetchJSON<OffersRequestType>(`${url}/offers`),
        fetchJSON<UserByIdRequestType[]>(`${url}/userById`),
        fetchJSON<City[]>(`${url}/cityById`),
        fetchJSON<PropertyType[]>(`${url}/propertyTypes`),
        fetchJSON<Conveniences[]>(`${url}/conveniences`),
      ])
        .then((values) => {
          const [
            offers,
            users,
            cities,
            propertyTypes,
            conveniences
          ] = values;
          return {
            users,
            names: offers.names,
            descriptions: offers.descriptions,
            cities,
            propertyTypes,
            conveniences
          };
        });
    } catch (e: unknown) {
      console.error('Can not load data');

      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  }

  public async execute(...params: string[]): Promise<void> {
    const [count, filepath, url] = params;
    const offerCount = Number(count);
    await this.load(url);
    await this.write(filepath, offerCount);
    console.log(`Finished generating ${count} offers`);
  }

  private async write(filePath: string, count: number) {
    const tsvOfferGenerator = new TsvOfferGenerator(this.initialData);
    const tsvFileWriter = new TsvFileWriter(filePath);
    for (let i = 0; i < count; i++) {
      void tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }
}
