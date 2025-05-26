import {Cities} from './cities.enum.js';

export type City = {
  id: Cities;
  name: Cities;
  coords: {
    latitude: number;
    longitude: number;
  };
}
