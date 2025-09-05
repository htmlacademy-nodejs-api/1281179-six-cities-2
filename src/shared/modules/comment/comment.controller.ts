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
import { DocumentExistMiddleware, ValidateObjectIdMiddleware } from '../../../apps/rest/index.js';

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
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistMiddleware(this.offerService, 'Offer', 'offerId')
      ],
    });
    this.addRoute({
      path: '/:offerId/comments/:commentId',
      method: HttpMethod.DELETE,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateObjectIdMiddleware('commentId'),
        new DocumentExistMiddleware(this.offerService, 'Offer', 'offerId'),
        new DocumentExistMiddleware(this.commentService, 'Comment', 'commentId')
      ]
    });
    this.addRoute({
      path: '/:offerId/comments/:commentId',
      method: HttpMethod.PUT,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateObjectIdMiddleware('commentId'),
        new DocumentExistMiddleware(this.offerService, 'Offer', 'offerId'),
        new DocumentExistMiddleware(this.commentService, 'Comment', 'commentId')
      ]
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
    const { text } = req.body ?? {};

    if (!text) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Field "text" is required', 'CommentController');
    }

    const offerExists = await this.offerService.exists(offerId);
    if (!offerExists) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found', 'CommentController');
    }

    const authorId = req.tokenPayload?.id;
    if (!authorId) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Field "userId" is required', 'CommentController');
    }

    const user = await this.userService.findUserById(authorId);
    if (!user) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `User with id "${authorId}" not found`, 'CommentController');
    }

    const dto: CreateCommentDto = {
      text,
      offerId,
      authorId,
    } as unknown as CreateCommentDto;

    const created = await this.commentService.create(dto);
    this.created(res, fillDTO(CommentRdo, created));
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    const { commentId } = req.params;
    await this.commentService.deleteById(commentId);
    this.noContent(res, 'Comment deleted successfully');
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const { commentId } = req.params;
    const commentDTO: CreateCommentDto = req.body;
    const comment = await this.commentService.updateById(commentId, commentDTO);
    this.ok(res, fillDTO(CommentRdo, comment));
  };
}


