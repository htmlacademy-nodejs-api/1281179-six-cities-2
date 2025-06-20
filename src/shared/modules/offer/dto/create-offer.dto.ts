import { Cities, ConvenienceType, Property, User } from '../../../types/index.js';

export class CreateOfferDto {
  name: string;
  description: string;
  publicationDate: string;
  city: Cities;
  previewImage: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: Property;
  roomCount: number;
  guestCount: number;
  cost: number;
  conveniences: ConvenienceType[];
  author: User;
  commentCount: number;
  coordinates: [number, number];
}
