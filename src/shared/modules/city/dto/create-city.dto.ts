import { IsArray, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Cities, Coords } from '../../../types/index.js';
import { CreateCityMessages } from './create-city.messages.js';

export class CreateCityDto {
  @IsEnum(Cities, { message: CreateCityMessages.name.invalid })
  @IsNotEmpty({ message: CreateCityMessages.name.required })
    name: Cities;

  @IsArray({ message: CreateCityMessages.coords.required })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true, message: CreateCityMessages.coords.length })
  @IsNotEmpty({ message: CreateCityMessages.coords.required })
    coords: Coords;
}
