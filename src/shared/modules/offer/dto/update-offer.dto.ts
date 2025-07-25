import { ConvenienceType, Property } from '../../../types/index.js';
import { Types } from 'mongoose';

export class UpdateOfferDto {
  public name?: string;

  public description?: string;

  public city?: Types.ObjectId;

  public previewImage?: string;

  public photos?: string[];

  public isPremium?: boolean;

  public isFavorite?: boolean;

  public rating?: number;

  public type?: Property;

  public roomCount?: number;

  public guestCount?: number;

  public cost?: number;

  public conveniences?: ConvenienceType[];

  public author?: Types.ObjectId;

  public coordinates?: [number, number];
}
