import { Expose } from 'class-transformer';
import { Cities } from '../../../types/cities.enum.js';

export class CityRdo {
  @Expose()
  public id!: string;

  @Expose()
  public name!: Cities;

  @Expose()
  public coords!: {
    latitude: number;
    longitude: number;
  };
}
