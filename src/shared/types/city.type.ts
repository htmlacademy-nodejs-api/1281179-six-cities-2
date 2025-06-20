import {Cities} from './cities.enum.js';

export type Coords = {
  latitude: number;
  longitude: number;
}
export type City = {
  name: Cities;
  coords: Coords;
}
