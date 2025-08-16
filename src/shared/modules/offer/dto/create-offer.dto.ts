import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';
import { Cities, ConvenienceType, Property } from '../../../types/index.js';
import { CreateOfferMessages } from './create-offer.messages.js';

export class CreateOfferDto {
  @IsString({ message: CreateOfferMessages.name.required })
  @Length(10, 100, { message: CreateOfferMessages.name.minLength })
  @IsNotEmpty({ message: CreateOfferMessages.name.required })
  public name!: string;

  @IsString({ message: CreateOfferMessages.description.required })
  @Length(10, 1024, { message: CreateOfferMessages.description.minLength })
  @IsNotEmpty({ message: CreateOfferMessages.description.required })
  public description!: string;

  @IsEnum(Cities, { message: CreateOfferMessages.city.invalid })
  @IsNotEmpty({ message: CreateOfferMessages.city.invalid })
  public city!: Cities;

  @IsString({ message: CreateOfferMessages.previewImage.required })
  @IsNotEmpty({ message: CreateOfferMessages.previewImage.required })
  public previewImage!: string;

  @IsArray({ message: CreateOfferMessages.photos.required })
  @IsString({ each: true, message: CreateOfferMessages.photos.required })
  @IsNotEmpty({ message: CreateOfferMessages.photos.required })
  public photos!: string[];

  @IsBoolean({ message: CreateOfferMessages.isPremium.required })
  @IsNotEmpty({ message: CreateOfferMessages.isPremium.required })
  public isPremium!: boolean;

  @IsBoolean({ message: CreateOfferMessages.isFavorite.required })
  @IsNotEmpty({ message: CreateOfferMessages.isFavorite.required })
  public isFavorite!: boolean;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: CreateOfferMessages.rating.required })
  @IsNotEmpty({ message: CreateOfferMessages.rating.required })
  public rating!: number;

  @IsEnum(Property, { message: CreateOfferMessages.type.invalid })
  @IsNotEmpty({ message: CreateOfferMessages.type.invalid })
  public type!: Property;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: CreateOfferMessages.roomCount.required })
  @IsNotEmpty({ message: CreateOfferMessages.roomCount.required })
  @Min(1, { message: CreateOfferMessages.roomCount.min })
  public roomCount!: number;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: CreateOfferMessages.guestCount.required })
  @IsNotEmpty({ message: CreateOfferMessages.guestCount.required })
  @Min(1, { message: CreateOfferMessages.guestCount.min })
  public guestCount!: number;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: CreateOfferMessages.cost.required })
  @IsNotEmpty({ message: CreateOfferMessages.cost.required })
  @Min(1, { message: CreateOfferMessages.cost.min })
  public cost!: number;

  @IsArray({ message: CreateOfferMessages.conveniences.required })
  @IsEnum(ConvenienceType, { each: true, message: CreateOfferMessages.conveniences.each })
  @IsNotEmpty({ message: CreateOfferMessages.conveniences.required })
  public conveniences!: ConvenienceType[];

  @IsString({ message: CreateOfferMessages.author.required })
  @IsNotEmpty({ message: CreateOfferMessages.author.required })
  public author!: string;

  @IsArray({ message: CreateOfferMessages.coordinates.required })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true, message: CreateOfferMessages.coordinates.length })
  @IsNotEmpty({ message: CreateOfferMessages.coordinates.required })
  @Length(2, 2, { message: CreateOfferMessages.coordinates.length })
  public coordinates!: [number, number];
}
