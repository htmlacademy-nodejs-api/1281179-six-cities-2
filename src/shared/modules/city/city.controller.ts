import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/components.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { HttpMethod } from '../../libs/rest/index.js';
import { Request, RequestHandler, Response } from 'express';
import { CityService } from './city-service.interface.js';
import { CreateCityDto } from './dto/create-city.dto.js';
import { CityRdo } from './rdo/city.rdo.js';
import { fillDTO } from '../../helpers/common.js';
import { Cities } from '../../types/cities.enum.js';

@injectable()
export class CityController extends BaseController {
  constructor(
    @inject(Components.Logger)
    protected readonly logger: Logger,
    @inject(Components.CityService)
    private readonly cityService: CityService,
  ) {
    super(logger);
    this.logger.info('Register routes for CityController');
    this.addRoute({
      path: '/',
      method: HttpMethod.GET,
      handler: this.index,
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.POST,
      handler: this.create,
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.DELETE,
      handler: this.delete,
    });
  }

  public index = async (_req: Request, res: Response): Promise<void> => {
    try {
      const cities = await this.cityService.findAllCities();
      const responseData = fillDTO(CityRdo, cities);
      this.ok(res, responseData);
    } catch (error) {
      this.logger.error('Failed to fetch cities:', error);
      this.internalServerError(res, { error: 'Failed to fetch cities' });
    }
  };

  public create:RequestHandler<unknown, CityRdo[], CreateCityDto> = async (req, res) => {
    try {
      this.logger.info('Received create city request', { body: req.body });

      if (!req.body) {
        this.badRequest(res, { error: 'Request body is required' });
        return;
      }

      const cityName = req.body.name?.toUpperCase() as keyof typeof Cities;

      if (!Cities[cityName]) {
        this.badRequest(res, { error: 'Invalid city name' });
        return;
      }

      const cityDto: CreateCityDto = {
        ...req.body,
        name: Cities[cityName as keyof typeof Cities]
      };

      this.logger.info('Creating city with data:', cityDto);
      const city = await this.cityService.createCity(cityDto);

      this.logger.info('City created successfully:', city);
      this.created(res, city);
    } catch (error) {
      this.logger.error('Failed to create city:', error);

      if (error instanceof Error && error.message.includes('duplicate key')) {
        this.conflict(res, { error: 'City with this name already exists' });
      } else {
        this.internalServerError(res, { error: 'Failed to create city' });
      }
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const city = await this.cityService.deleteCityById(id);
      this.ok(res, city);
    } catch (error) {
      this.logger.error('Failed to delete city:', error);
      this.internalServerError(res, { error: 'Failed to delete city' });
    }
  };
}
