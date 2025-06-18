import crypto from 'node:crypto';
import {OfferGenerator} from './offer-generator.interface.js';
import {MockServerDataRequestType} from '../../types/index.js';
import {generateRandomValue, getRandomItem, getRandomItems} from '../../helpers/index.js';

export class TsvOfferGenerator implements OfferGenerator {
  private readonly MIN_OFFER_DAYS = 0;
  private readonly MAX_OFFER_DAYS = 15;

  private readonly MIN_RATING = 1;
  private readonly MAX_RATING = 5;

  private readonly MIN_COST = 100;
  private readonly MAX_COST = 100_000;

  private readonly MIN_ROOM_COUNT = 1;
  private readonly MAX_ROOM_COUNT = 8;

  private readonly MIN_GUEST_COUNT = 1;
  private readonly MAX_GUEST_COUNT = 10;

  constructor(private readonly mockData?: MockServerDataRequestType) {
  }

  public generate(): string {
    if (!this.mockData) {
      throw new Error('MockData is undefined');
    }

    const currentDate = new Date();
    const publicationDate = new Date(currentDate.setDate(currentDate.getDate() - generateRandomValue(this.MIN_OFFER_DAYS, this.MAX_OFFER_DAYS))).toISOString();
    const city = getRandomItem(this.mockData.cities);
    const offer = {
      name: getRandomItem(this.mockData.names),
      description: getRandomItem(this.mockData.descriptions),
      publicationDate,
      city: crypto.createHash('sha256'),
      previewImage: `https://cdn2.thecatapi.com/images/${generateRandomValue(0, 1000)}.jpg`,
      photos: [
        `https://cdn2.thecatapi.com/images/${generateRandomValue(0, 1000)}.jpg`,
        `https://cdn2.thecatapi.com/images/${generateRandomValue(0, 1000)}.jpg`,
        `https://cdn2.thecatapi.com/images/${generateRandomValue(0, 1000)}.jpg`,
        `https://cdn2.thecatapi.com/images/${generateRandomValue(0, 1000)}.jpg`,
        `https://cdn2.thecatapi.com/images/${generateRandomValue(0, 1000)}.jpg`,
        `https://cdn2.thecatapi.com/images/${generateRandomValue(0, 1000)}.jpg`,
      ].join(';'),
      isPremium: getRandomItem([true, false]),
      isFavorite: getRandomItem([true, false]),
      rating: generateRandomValue(this.MIN_RATING, this.MAX_RATING, 1),
      type: getRandomItem(this.mockData.propertyTypes).name,
      roomCount: generateRandomValue(this.MIN_ROOM_COUNT, this.MAX_ROOM_COUNT),
      guestCount: generateRandomValue(this.MIN_GUEST_COUNT, this.MAX_GUEST_COUNT),
      cost: generateRandomValue(this.MIN_COST, this.MAX_COST),
      conveniences: getRandomItems(this.mockData.conveniences.map((el) => el.name)).join(';'),
      author: getRandomItem(this.mockData.users).id,
      commentCount: generateRandomValue(0, 100),
      coordinates: [city.coords.latitude, city.coords.longitude].join(';')
    };

    return Object.values(offer).join('\t');
  }
}
