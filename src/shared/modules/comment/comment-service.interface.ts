import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { DocumentExist } from '../../types/document-exist.interface.js';

/**
 * Интерфейс для операций с комментариями
 * Предоставляет методы для создания, поиска и удаления комментариев
 */
export interface CommentService extends DocumentExist {
  /**
   * Создает новый комментарий
   * @param dto - Объект передачи данных, содержащий информацию о комментарии
   * @returns Promise, разрешающийся в созданный документ комментария
   */
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;

  /**
   * Находит все комментарии для конкретного предложения
   * @param offerId - ID предложения, для которого нужно найти комментарии
   * @returns Promise, разрешающийся в массив документов комментариев
   */
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;

  /**
   * Удаляет все комментарии, связанные с конкретным предложением
   * @param offerId - ID предложения, комментарии которого нужно удалить
   * @returns Promise, разрешающийся в количество удаленных комментариев
   */
  deleteByOfferId(offerId: string): Promise<number>;

  /**
   * Обновляет комментарий по его идентификатору
   * @param commentId - ID комментария, который нужно обновить
   * @param dto - Объект передачи данных с обновлённой информацией о комментарии
   * @returns Promise, разрешающийся в обновлённый документ комментария или null, если не найден
   */
  updateById(commentId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity> | null>;

  /**
   * Удаляет комментарий по его идентификатору
   * @param commentId - ID комментария, который нужно удалить
   * @returns Promise, разрешающийся в количество удаленных комментариев
   */
  deleteById(commentId: string): Promise<number>;
}
