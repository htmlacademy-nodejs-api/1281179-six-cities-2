import { DocumentType } from '@typegoose/typegoose';
import { CityEntity } from './city.entity.js';
import { CreateCityDto } from './dto/create-city.dto.js';

export interface CityService {
  createCity(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  findCityByCityId(cityId: string): Promise<DocumentType<CityEntity> | null>;
  findCityByCityName(name: string): Promise<DocumentType<CityEntity> | null>;
  findCityByCityNameOrCreate(cityId: string, dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  findAllCities(): Promise<DocumentType<CityEntity>[]>;
}
