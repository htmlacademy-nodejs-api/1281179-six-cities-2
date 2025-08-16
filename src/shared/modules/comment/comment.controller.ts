import { inject, injectable } from 'inversify';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Components } from '../../types/components.enum.js';
import { HttpError } from '../../libs/rest/errors/http-error.js';
import { HttpMethod } from '../../libs/rest/types/http-method.enum.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CommentService } from './comment-service.interface.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { UserService } from '../user/user-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { fillDTO } from '../../helpers/common.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../../apps/rest/index.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Components.Logger)
    protected readonly logger: Logger,
    @inject(Components.CommentService)
    private readonly commentService: CommentService,
    @inject(Components.OfferService)
    private readonly offerService: OfferService,
    @inject(Components.UserService)
    private readonly userService: UserService,
  ) {
    super(logger);
    this.logger.info('Register routes for CommentController');
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.GET,
      handler: this.index,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.POST,
      handler: this.create,
      middlewares: [new ValidateObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(CreateCommentDto)],
    });
  }

  public index = async (req: Request, res: Response): Promise<void> => {
    const { offerId } = req.params;

    const exists = await this.offerService.exists(offerId);
    if (!exists) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found', 'CommentController');
    }

    const comments = await this.commentService.findByOfferId(offerId);
    const responseData = fillDTO(CommentRdo, comments);
    this.ok(res, responseData);
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    const { offerId } = req.params;
    const { text, userId } = req.body ?? {};

    if (!text) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Field "text" is required', 'CommentController');
    }

    const offerExists = await this.offerService.exists(offerId);
    if (!offerExists) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found', 'CommentController');
    }

    // TODO: после добавления авторизации использовать id авторизованного пользователя
    if (!userId) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Field "userId" is required', 'CommentController');
    }

    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `User with id "${userId}" not found`, 'CommentController');
    }

    const dto: CreateCommentDto = {
      text,
      offerId,
      authorId: userId,
      userId, // временно дублируем до внедрения авторизации
    } as unknown as CreateCommentDto;

    const created = await this.commentService.create(dto);
    this.created(res, created);
  };
}


