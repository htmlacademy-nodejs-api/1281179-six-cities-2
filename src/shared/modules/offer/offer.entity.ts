import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Cities } from '../../types/cities.enum.js';
import { ConvenienceType } from '../../types/conveniences.type.js';
import { Property } from '../../types/property.type.js';
import { CityEntity } from '../city/city.entity.js';
import { UserEntity } from '../user/user.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({ schemaOptions: { collection: 'offers', timestamps: true }})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop()
  public name: string;

  @prop()
  public description: string;


  @prop()
  public publicationDate: string;

  @prop({
    ref: CityEntity,
    required: true,
    _id: false
  })
  public city: Cities;

  @prop()
  public previewImage: string;

  @prop()
  public photos: string[];

  @prop()
  public isPremium: boolean;

  @prop()
  public isFavorite: boolean;

  @prop()
  public rating: number;

  @prop({
    enum: Property,
    required: true,
  })
  public type: Property;

  @prop()
  public roomCount: number;

  @prop()
  public guestCount: number;

  @prop()
  public cost: number;

  @prop()
  public conveniences: ConvenienceType[];

  @prop({
    ref: UserEntity,
    required: true,
  })
  public user: Ref<UserEntity> ;

  @prop()
  public commentCount: number;

  @prop()
  public coordinates: [number, number];
}

export const OfferModel = getModelForClass(OfferEntity);
