import { Types } from 'mongoose';
import { OfferEntity } from '../offer/index.js';
import { UserEntity } from '../user/index.js';
import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';

/**
 * Сущность комментария
 * Описывает структуру комментария в базе данных
 *
 * Это то, с чего начинается описание сущностей в приложении.
 * Здесь мы определяем схему данных, которая будет использоваться
 * для создания коллекции в MongoDB через Typegoose.
 */
@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  },
})
export class CommentEntity extends defaultClasses.TimeStamps {
  /**
   * Уникальный идентификатор комментария в базе данных
   */
  @prop({ type: () => Types.ObjectId, required: true, default: () => new Types.ObjectId() })
  public _id: Types.ObjectId;

  /**
   * Текст комментария
   * Обязательное поле для хранения содержимого комментария
   */
  @prop({ required: true })
  public text: string;

  /**
   * Ссылка на предложение (offer)
   * Обязательное поле, указывающее к какому предложению относится комментарий
   */
  @prop({ ref: OfferEntity, required: true })
  public offerId: Ref<OfferEntity>;

  /**
   * Ссылка на автора комментария
   * Обязательное поле, указывающее кто оставил комментарий
   */
  @prop({ ref: UserEntity, required: true })
  public authorId: Ref<UserEntity>;
}

/**
 * Модель комментария для работы с базой данных
 * Создается на основе класса CommentEntity
 */
export const CommentModel = getModelForClass(CommentEntity);
