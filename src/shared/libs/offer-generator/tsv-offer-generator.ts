import {OfferGenerator} from './offer-generator.interface.js';
import {MockServerDataRequestType} from '../../types/index.js';
import {generateRandomValue, getRandomItem, getRandomItems} from '../../helpers/index.js';

const MIN_OFFER_DAYS = 0;
const MAX_OFFER_DAYS = 15;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_COST = 100;
const MAX_COST = 100_000;

const MIN_ROOM_COUNT = 1;
const MAX_ROOM_COUNT = 8;

const MIN_GUEST_COUNT = 1;
const MAX_GUEST_COUNT = 10;

export class TsvOfferGenerator implements OfferGenerator {

  constructor(private readonly mockData: MockServerDataRequestType) {
  }

  public generate(): string {
    const currentDate = new Date();
    const publicationDate = new Date(currentDate.setDate(currentDate.getDate() - generateRandomValue(MIN_OFFER_DAYS, MAX_OFFER_DAYS))).toISOString();
    const city = getRandomItem(this.mockData.cities);
    const offer = {
      name: getRandomItem(this.mockData.names),
      description: getRandomItem(this.mockData.descriptions),
      publicationDate,
      city: city.id,
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
      rating: generateRandomValue(MIN_RATING, MAX_RATING, 1),
      type: getRandomItem(this.mockData.propertyTypes).name,
      roomCount: generateRandomValue(MIN_ROOM_COUNT, MAX_ROOM_COUNT),
      guestCount: generateRandomValue(MIN_GUEST_COUNT, MAX_GUEST_COUNT),
      cost: generateRandomValue(MIN_COST, MAX_COST),
      conveniences: getRandomItems(this.mockData.conveniences.map((el) => el.name)).join(';'),
      author: getRandomItem(this.mockData.users).id,
      commentCount: generateRandomValue(0, 100),
      coordinates: [city.coords.latitude, city.coords.longitude].join(';')
    };

    return Object.values(offer).join('\t');
  }
}
