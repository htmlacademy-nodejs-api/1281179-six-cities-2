import { ConvenienceType, Property } from '../../../types/index.js';

export class CreateOfferDto {
  name: string;
  description: string;
  publicationDate: string;
  city: string;
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
  user: string;
  commentCount: number;
  coordinates: [number, number];
}
