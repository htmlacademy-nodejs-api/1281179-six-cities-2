import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { ConvenienceType } from '../../types/conveniences.type.js';
import { Property } from '../../types/property.type.js';
import { UserEntity } from '../user/user.entity.js';
import { Types } from 'mongoose';
import { CityEntity } from '../city/city.entity.js';

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    type: () => Types.ObjectId,
    required: true,
    default: () => new Types.ObjectId()
  })
  public _id: Types.ObjectId;

  @prop({
    required: true,
    trim: true,
    minLength: [10, 'Название должно быть минимум 10 символов'],
    maxLength: [100, 'Название должно быть максимум 100 символов']
  })
  public name!: string;

  @prop({
    required: true,
    trim: true,
    minLength: [20, 'Описание должно быть минимум 20 символов'],
    maxLength: [1024, 'Описание должно быть максимум 1024 символа']
  })
  public description!: string;

  @prop({
    ref: CityEntity,
    required: true,
  })
  public city!: Ref<CityEntity>;

  @prop({
    required: true,
    trim: true
  })
  public previewImage!: string;

  @prop({
    required: true,
    type: () => [String],
    validate: {
      validator: (v: string[]) => v.length === 6,
      message: 'Необходимо предоставить ровно 6 фотографий'
    }
  })
  public photos!: string[];

  @prop({
    required: true,
    default: false
  })
  public isPremium!: boolean;

  @prop({
    required: true,
    default: false
  })
  public isFavorite!: boolean;

  @prop({
    required: true,
    default: 0
  })
  public ratingCount!: number;

  @prop({
    min: [1, 'Минимальный рейтинг 1'],
    max: [5, 'Максимальный рейтинг 5'],
    type: Number,
    default: null
  })
  public rating!: number | null;

  @prop({
    required: true,
    type: () => String,
    enum: Property
  })
  public type!: Property;

  @prop({
    required: true,
    min: [1, 'Минимальное количество комнат 1'],
    max: [8, 'Максимальное количество комнат 8']
  })
  public roomCount!: number;

  @prop({
    required: true,
    min: [1, 'Минимальное количество гостей 1'],
    max: [10, 'Максимальное количество гостей 10']
  })
  public guestCount!: number;

  @prop({
    required: true,
    min: [100, 'Минимальная стоимость 100'],
    max: [100000, 'Максимальная стоимость 100000']
  })
  public cost!: number;

  @prop({
    required: true,
    type: () => [String],
    enum: ConvenienceType,
    validate: {
      validator: (v: ConvenienceType[]) => v.length > 0,
      message: 'Необходимо указать хотя бы одно удобство'
    }
  })
  public conveniences!: ConvenienceType[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public author!: Ref<UserEntity>;

  @prop({
    default: 0
  })
  public commentCount!: number;

  @prop({
    required: true,
    type: () => [Number],
    validate: {
      validator: (v: number[]) => v.length === 2,
      message: 'Координаты должны быть представлены широтой и долготой (2 числа)'
    }
  })
  public coordinates!: [number, number];
}

export const OfferModel = getModelForClass(OfferEntity);
