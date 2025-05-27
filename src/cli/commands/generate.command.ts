import {Command} from './command.interface.js';
import {
  City,
  Conveniences,
  MockServerDataRequestType,
  OffersRequestType,
  PropertyType,
  UserByIdRequestType
} from '../../shared/types/index.js';
import got from 'got';
import {TsvOfferGenerator} from '../../shared/libs/offer-generator/tsv-offer-generator.js';
import {appendFile} from 'node:fs/promises';

export class GenerateCommand implements Command {
  private initialData?: MockServerDataRequestType;
  private readonly name = '--generate';

  public getName(): string {
    return this.name;
  }

  public async load(url: string) {
    try {
      this.initialData = await Promise.all([
        got.get(`${url}/offers`).json<OffersRequestType>(),
        got.get(`${url}/userById`).json<UserByIdRequestType[]>(),
        got.get(`${url}/cityById`).json<City[]>(),
        got.get(`${url}/propertyTypes`).json<PropertyType[]>(),
        got.get(`${url}/conveniences`).json<Conveniences[]>(),
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
    for (let i = 0; i < count; i++) {
      await appendFile(filePath, `${tsvOfferGenerator.generate()}\n`, 'utf-8');
    }
  }
}
