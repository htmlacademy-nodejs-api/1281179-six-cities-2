import { Cities, ConvenienceType, Property } from '../../../types/index.js';

export class CreateOfferDto {
  public name!: string;

  public description!: string;

  public city!: Cities;

  public previewImage!: string;

  public photos!: string[];

  public isPremium!: boolean;

  public isFavorite!: boolean;

  public rating?: number;

  public type!: Property;

  public roomCount!: number;

  public guestCount!: number;

  public cost!: number;

  public conveniences!: ConvenienceType[];

  public author!: string;

  public coordinates!: [number, number];
}
