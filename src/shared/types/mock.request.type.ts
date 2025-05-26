import {UserType} from './user.type.js';
import {City} from './city.type.js';
import {Property} from './property.type.js';
import {Convenience} from './conveniences.type.js';

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

export type PropertyType = {
  id: number,
  name: Property
}

export type Conveniences = {
  id: number,
  name: Convenience
}

export type MockServerDataRequestType = {
  users: UserByIdRequestType[];
  cities: City[];
  propertyTypes: PropertyType[];
  conveniences: Conveniences[]
} & OffersRequestType
