import { inject, injectable } from 'inversify';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Components } from '../../types/components.enum.js';
import { HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Request, RequestHandler, Response } from 'express';
import { UserRequest, UserResponse } from '../../types/user.type.js';
import { UserService } from './user-service.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/common.js';
import { UserRdo } from './rdo/user.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { DocumentExistMiddleware, ValidateObjectIdMiddleware, ValidateDtoMiddleware, UploadFileMiddleware } from '../../../apps/rest/index.js';
import { AuthService } from '../auth/auth-service.interface.js';
import { LoginUserRdo } from './rdo/login-user.rdo.js';
@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Components.Logger)
    protected readonly logger: Logger,
    @inject(Components.UserService)
    protected readonly userService: UserService,
    @inject(Components.RestConfig)
    private readonly config: Config<RestSchema>,
    @inject(Components.AuthService)
    private readonly authService: AuthService,
  ) {
    super(logger);
    this.addRoute({
      path: '/register',
      method: HttpMethod.POST,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.GET,
      handler: this.index
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.POST,
      handler: this.login
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.GET,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistMiddleware(this.userService, 'User', 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.DELETE,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistMiddleware(this.userService, 'User', 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.PUT,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistMiddleware(this.userService, 'User', 'id')
      ]
    });
    this.addRoute({
      path: '/:id/avatar',
      method: HttpMethod.POST,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistMiddleware(this.userService, 'User', 'id'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar')
      ]
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

  public login: RequestHandler<unknown, UserResponse, UserRequest> = async (req, res) => {
    const user = await this.authService.verify(req.body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoginUserRdo, {email: user.email, token});

    this.ok(res, responseData);
  };

  public show = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await this.userService.findUserById(id);
    this.ok(res, fillDTO(UserRdo, user));
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userDTO: CreateUserDto = req.body;
    const user = await this.userService.updateById(id, userDTO);
    this.ok(res, fillDTO(UserRdo, user));
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.userService.deleteById(id);
    this.noContent(res, 'User deleted successfully');
  };

  public uploadAvatar = async (req: Request, res: Response): Promise<void> => {
    this.created(res, { filepath: req.file?.path });
  };
}
