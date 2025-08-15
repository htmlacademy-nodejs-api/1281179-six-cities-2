import { Expose, Transform, Type } from 'class-transformer';
import { ConvenienceType } from '../../../types/conveniences.type.js';
import { Property } from '../../../types/property.type.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class OfferRdo {
  @Expose()
  @Transform(({ obj }) => {
    if (obj?.id) {
      return String(obj.id);
    }
    if (obj?._id) {
      return String(obj._id);
    }
    return undefined;
  })
  public id!: string;

  @Expose()
  public name!: string; // Наименование. Обязательное. Мин. длин 10 символов, макс. длина 100;

  @Expose()
  public description!: string; // Описание предложения. Обязательное. Мин. длина 20 символов, макс. длина 1024 символа;

  @Expose({ name: 'createdAt' })
  public publicationDate!: string; // Дата публикации предложения. Обязательное. ISO format

  @Expose()
  @Transform(({ obj }) => {
    const value = obj?.city;
    if (!value) {
      return value;
    }
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'object' && 'name' in value) {
      return String((value as { name: unknown }).name);
    }
    return String(value);
  })
  public city!: string; // Город. Обязательное. Один из шести городов.

  @Expose()
  public previewImage: string; // Превью изображения. Обязательное. Ссылка на изображение, которое используется в качестве превью;

  @Expose()
  public photos: string[]; // Фотографии жилья. Обязательное. Список ссылок на фотографии жилья. Всегда 6 фотографий;

  @Expose()
  public isPremium: boolean; // Флаг «Премиум». Обязательное. Признак премиальности предложения;

  @Expose()
  public isFavorite: boolean; // Флаг «Избранное». Обязательное. Признак того, что предложение принадлежит списку избранных предложений пользователя;

  @Expose()
  @Transform(({ obj }) => (obj?.rating ?? 0))
  public rating: number; // Рейтинг. Обязательное. Число от 1 до 5. Допускаются числа с запятой (1 знак после запятой);

  @Expose()
  public type: Property; // Тип жилья. Обязательное. Один из вариантов: apartment, house, room, hotel;

  @Expose()
  public roomCount: number; // Количество комнат. Обязательное. Мин. 1, Макс. 8;

  @Expose()
  public guestCount: number; // Количество гостей. Обязательное. Мин. 1, Макс. 10;

  @Expose()
  public cost: number; // Стоимость аренды. Обязательное. Мин. 100, Макс. 100 000;

  @Expose()
  public conveniences: ConvenienceType[]; // Удобства. Обязательное. Список удобств. Один или несколько вариантов из списка: Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels, Fridge;

  @Expose()
  @Type(() => UserRdo)
  public author: UserRdo; // Автор предложения. Обязательное. Ссылка на сущность «Пользователь»;

  @Expose()
  public commentCount: number; // Количество комментариев. Рассчитывается автоматически;

  @Expose()
  public coordinates: [number, number]; // Координаты
}
