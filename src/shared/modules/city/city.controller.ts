import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/components.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CityService } from './city-service.interface.js';
import { CreateCityDto } from './dto/create-city.dto.js';
import { CityRdo } from './rdo/city.rdo.js';
import { fillDTO } from '../../helpers/common.js';
import { Cities } from '../../types/cities.enum.js';
import { DocumentExistMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../../apps/rest/index.js';

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
      middlewares: [new ValidateDtoMiddleware(CreateCityDto)]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.DELETE,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistMiddleware(this.cityService, 'City', 'id')
      ],
    });
  }

  public index = async (_req: Request, res: Response): Promise<void> => {
    const cities = await this.cityService.findAllCities();
    const responseData = fillDTO(CityRdo, cities);
    this.ok(res, responseData);
  };

  public create:RequestHandler<unknown, CityRdo[], CreateCityDto> = async (req, res) => {
    this.logger.info('Received create city request', { body: req.body });

    if (!req.body) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Request body is required', 'CityController');
    }

    const cityName = req.body.name?.toUpperCase() as keyof typeof Cities;

    if (!Cities[cityName]) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Invalid city name', 'CityController');
    }

    const cityDto: CreateCityDto = {
      ...req.body,
      name: Cities[cityName as keyof typeof Cities]
    };

    this.logger.info('Creating city with data:', cityDto);
    try {
      const city = await this.cityService.createCity(cityDto);
      this.logger.info('City created successfully:', city);
      this.created(res, city);
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw new HttpError(StatusCodes.CONFLICT, 'City with this name already exists', 'CityController');
      }
      throw error;
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const city = await this.cityService.deleteCityById(id);
    if (!city) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'City not found', 'CityController');
    }
    this.ok(res, city);
  };
}
