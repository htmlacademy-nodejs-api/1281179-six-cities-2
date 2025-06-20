import { DocumentType, types } from '@typegoose/typegoose';
import { CityService } from './city-service.interface.js';
import { CityEntity } from './city.entity.js';
import { CreateCityDto } from './dto/create-city.dto.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/components.enum.js';
import { Logger } from '../../libs/logger/index.js';

@injectable()
export class DefaultCityService implements CityService {

  constructor(
    @inject(Components.CityModel)
    private readonly cityModel: types.ModelType<CityEntity>,

    @inject(Components.Logger)
    private readonly logger: Logger
  ) {}

  async createCity(dto: CreateCityDto): Promise<DocumentType<CityEntity>> {
    const result = await this.cityModel.create(dto);
    this.logger.info('City was successfully created');
    return result;
  }

  findCityByCityId(cityId: string): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findById(cityId).exec();
  }

  findCityByCityName(name: string): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findOne({ name }).exec();
  }

  async findCityByCityNameOrCreate(cityName: string, dto: CreateCityDto): Promise<DocumentType<CityEntity>> {
    const city = await this.findCityByCityName(cityName);

    if (city) {
      return city;
    }

    return this.createCity(dto);
  }
}
