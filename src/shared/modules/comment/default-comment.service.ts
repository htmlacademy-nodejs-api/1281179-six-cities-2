import { inject } from 'inversify';
import { Components } from '../../types/components.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { CommentService } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';
import { types } from '@typegoose/typegoose';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { OfferService } from '../offer/offer-service.interface.js';

/**
 * Сервис для работы с комментариями
 * Реализует интерфейс CommentService
 */
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger,

    @inject(Components.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,

    @inject(Components.OfferService)
    private readonly offerService: OfferService
  ) {}

  /**
   * Создает новый комментарий
   * @param {CreateCommentDto} dto - DTO с данными для создания комментария
   * @returns {Promise<types.DocumentType<CommentEntity>>} Созданный комментарий
   */
  public async create(dto: CreateCommentDto): Promise<types.DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    await this.offerService.incrementCommentCount(dto.offerId);
    this.logger.info(`New comment created: ${comment.text}`);
    return comment;
  }

  /**
   * Находит все комментарии для конкретного предложения
   * @param {string} offerId - ID предложения
   * @returns {Promise<types.DocumentType<CommentEntity>[]>} Массив комментариев
   */
  public async findByOfferId(offerId: string): Promise<types.DocumentType<CommentEntity>[]> {
    return this.commentModel.find({ offerId }).populate('authorId');
  }

  /**
   * Удаляет все комментарии для конкретного предложения
   * @param {string} offerId - ID предложения
   * @returns {Promise<number>} Количество удаленных комментариев
   */
  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();
    return result.deletedCount;
  }

  /**
   * Обновляет комментарий по его идентификатору
   * @param {string} commentId - ID комментария, который нужно обновить
   * @param {CreateCommentDto} dto - Объект передачи данных с обновлённой информацией о комментарии
   * @returns {Promise<types.DocumentType<CommentEntity> | null>} Обновлённый комментарий или null, если не найден
   */
  public async updateById(commentId: string, dto: CreateCommentDto): Promise<types.DocumentType<CommentEntity> | null> {
    return this.commentModel.findByIdAndUpdate(commentId, dto, { new: true }).exec();
  }

  /**
   * Удаляет комментарий по его идентификатору
   * @param {string} commentId - ID комментария, который нужно удалить
   * @returns {Promise<number>} Количество удаленных комментариев
   */
  public async deleteById(commentId: string): Promise<number> {
    const result = await this.commentModel.deleteOne({ _id: commentId }).exec();
    return result.deletedCount ?? 0;
  }

  /**
   * Проверяет, существует ли комментарий по его идентификатору
   * @param {string} documentId - ID комментария
   * @returns {Promise<boolean>} true, если комментарий существует, false в противном случае
   */
  async exists(documentId: string): Promise<boolean> {
    return (await this.commentModel.exists({ _id: documentId })) !== null;
  }
}
