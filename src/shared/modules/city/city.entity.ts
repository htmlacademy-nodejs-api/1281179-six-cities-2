import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Cities, City, Coords } from '../../types/index.js';
import { Types } from 'mongoose';

@modelOptions({ schemaOptions: { collection: 'cities', timestamps: true } })
export class CityEntity extends defaultClasses.TimeStamps implements City {
  @prop({
    type: () => Types.ObjectId,
    required: true,
    default: () => new Types.ObjectId()
  })
  public _id: Types.ObjectId;

  @prop({
    type: () => String,
    required: true,
    unique: true,
    enum: Cities,
  })
  public name: Cities;

  @prop({
    type: Object,
    required: true,
  })
  public coords: Coords;
}

export const CityModel = getModelForClass(CityEntity);
