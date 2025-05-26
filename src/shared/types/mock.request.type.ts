import {UserType} from './user.type.js';
import {Cities} from './cities.enum.js';

export type OffersRequestType = {
  names: string[];
  descriptions: string[];
}

export type UserByIdRequestType = {
  id: number;
  name: string;
  email: string;
  photo: string;
  password: string;
  userType: UserType;
}

export type CityRequestType = {
  id: string;
  name: Cities;
  coords: {
    latitude: number;
    longitude: number;
  };
}
