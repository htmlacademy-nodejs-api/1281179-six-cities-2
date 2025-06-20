/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Cities, City, Coords } from '../../types/index.js';

export interface CityEntity extends defaultClasses.Base {}
@modelOptions({ schemaOptions: { collection: 'cities', timestamps: true } })
export class CityEntity extends defaultClasses.TimeStamps implements City {
  @prop({
    type: () => String,
    requirid: true,
    unique: true,
    enum: Cities,
  })
  public name: Cities;

  @prop({
    type: Object,
    requirid: true,
  })
  public coords: Coords;
}

export const CityModel = getModelForClass(CityEntity);
