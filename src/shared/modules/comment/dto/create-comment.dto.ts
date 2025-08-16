import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CreateCommentMessages } from './create-comment.messages.js';

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessages.text.required })
  @Length(50, 1024, { message: CreateCommentMessages.text.minLength })
  @IsNotEmpty({ message: CreateCommentMessages.text.required })
    text: string;

  @IsString({ message: CreateCommentMessages.offerId.required })
  @IsNotEmpty({ message: CreateCommentMessages.offerId.required })
    offerId: string;

  // TODO: убрать после добавления авторизации
  @IsString({ message: CreateCommentMessages.userId.required })
  @IsNotEmpty({ message: CreateCommentMessages.userId.required })
    userId: string;

  // Используется сущностью и сервисом
  @IsString({ message: CreateCommentMessages.authorId.required })
  @IsNotEmpty({ message: CreateCommentMessages.authorId.required })
    authorId: string;
}
