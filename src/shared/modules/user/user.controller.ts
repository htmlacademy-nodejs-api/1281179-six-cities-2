import { inject, injectable } from 'inversify';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Components } from '../../types/components.enum.js';
import { HttpError, HttpMethod } from '../../libs/rest/index.js';
import { RequestHandler } from 'express';
import { UserRequest, UserResponse } from '../../types/user.type.js';
import { UserService } from './user-service.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/common.js';
import { UserRdo } from './rdo/user.rdo.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Components.Logger)
    protected readonly logger: Logger,
    @inject(Components.UserService)
    protected readonly userService: UserService,
    @inject(Components.RestConfig)
    private readonly config: Config<RestSchema>,
  ) {
    super(logger);
    this.addRoute({
      path: '/',
      method: HttpMethod.POST,
      handler: this.create
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.GET,
      handler: this.index
    });
  }

  public index: RequestHandler<unknown, UserResponse, UserRequest> = async (_req, res) => {
    const users = await this.userService.findAll();
    this.ok(res, fillDTO(UserRdo, users));
  };

  public create: RequestHandler<unknown, UserResponse, UserRequest> = async (req, res) => {
    const userDTO: CreateUserDto = req.body;

    const existingUser = await this.userService.findByEmail(userDTO.email);
    if (existingUser) {
      throw new HttpError(StatusCodes.CONFLICT, 'User already exists', 'UserController');
    }

    const user = await this.userService.create(userDTO, this.config.get('SALT'));

    if (!user) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'User not found', 'UserController');
    }

    const userEntity = fillDTO(UserRdo, user);
    this.created(res, userEntity);
  };
}
