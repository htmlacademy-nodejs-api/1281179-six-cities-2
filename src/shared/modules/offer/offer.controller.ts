import { inject, injectable } from 'inversify';
import { Logger } from '../../../shared/libs/logger/logger.interface.js';
import { Components } from '../../types/components.enum.js';
import { OfferService } from './offer-service.interface.js';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { HttpMethod } from '../../libs/rest/types/http-method.enum.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { CityService } from '../city/city-service.interface.js';
import { Cities } from '../../types/cities.enum.js';
import { UserService } from '../user/user-service.interface.js';
import { HttpError } from '../../libs/rest/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { DocumentExistMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../../apps/rest/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Components.Logger)
    protected readonly logger: Logger,
    @inject(Components.OfferService)
    private readonly offerService: OfferService,
    @inject(Components.CityService)
    private readonly cityService: CityService,
    @inject(Components.UserService)
    private readonly userService: UserService,
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController');
    this.addRoute({
      path: '/',
      method: HttpMethod.GET,
      handler: this.index,
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.GET,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistMiddleware(this.offerService, 'Offer', 'id')
      ],
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.POST,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateOfferDto)
      ],
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.PUT,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistMiddleware(this.offerService, 'Offer', 'id')
      ],
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.DELETE,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistMiddleware(this.offerService, 'Offer', 'id')
      ],
    });
  }

  public index = async (_req: Request, res: Response): Promise<void> => {
    const offers = await this.offerService.findAllOffers();
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  };

  public show = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const offer = await this.offerService.findByOfferId(id);

    const responseData = fillDTO(OfferRdo, offer);
    this.ok(res, responseData);
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    const { city, author, ...rest } = req.body ?? {};

    if (!city) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'City name is required in field "city"', 'OfferController');
    }

    const cityName = city.toUpperCase() as keyof typeof Cities;

    if (!Cities[cityName]) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `City with name "${city}" not found`, 'OfferController');
    }

    const existedCity = await this.cityService.findCityByCityName(Cities[cityName]);
    if (!existedCity) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `City with name "${city}" not found`, 'OfferController');
    }

    const existedUser = await this.userService.findUserById(author);
    if (!existedUser) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `User with id "${author}" not found`, 'OfferController');
    }

    const offerDTO: CreateOfferDto = {
      ...rest,
      author,
      city: existedCity._id,
    } as CreateOfferDto;

    const offer = await this.offerService.create(offerDTO);
    const responseData = fillDTO(OfferRdo, offer);
    this.created(res, responseData);
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const offer = await this.offerService.updateById(id, req.body);
    const responseData = fillDTO(OfferRdo, offer);
    this.ok(res, responseData);
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.offerService.deleteById(id);
    this.noContent(res, 'Offer deleted successfully');
  };
}
