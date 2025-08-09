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

  // ratingCount управляется сервером, не должен приходить с клиента

  public type?: Property;

  public roomCount?: number;

  public guestCount?: number;

  public cost?: number;

  public conveniences?: ConvenienceType[];

  // author ставится на сервере из контекста пользователя, не должен обновляться клиентом

  public coordinates?: [number, number];
}
