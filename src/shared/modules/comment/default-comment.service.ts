import { inject } from 'inversify';
import { Components } from '../../types/components.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { CommentService } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';
import { types } from '@typegoose/typegoose';
import { CreateCommentDto } from './dto/create-comment.dto.js';

/**
 * Сервис для работы с комментариями
 * Реализует интерфейс CommentService
 */
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger,

    @inject(Components.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  /**
   * Создает новый комментарий
   * @param {CreateCommentDto} dto - DTO с данными для создания комментария
   * @returns {Promise<types.DocumentType<CommentEntity>>} Созданный комментарий
   */
  public async create(dto: CreateCommentDto): Promise<types.DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    this.logger.info(`New comment created: ${comment.text}`);
    return comment;
  }

  /**
   * Находит все комментарии для конкретного предложения
   * @param {string} offerId - ID предложения
   * @returns {Promise<types.DocumentType<CommentEntity>[]>} Массив комментариев
   */
  public async findByOfferId(offerId: string): Promise<types.DocumentType<CommentEntity>[]> {
    return this.commentModel.find({ offerId }).populate('userId');
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
}
