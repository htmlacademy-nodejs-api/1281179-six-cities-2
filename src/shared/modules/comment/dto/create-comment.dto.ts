import { IsMongoId, IsNotEmpty, IsString, Length } from 'class-validator';
import { CreateCommentMessages } from './create-comment.messages.js';

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessages.text.required })
  @Length(50, 1024, { message: CreateCommentMessages.text.minLength })
  @IsNotEmpty({ message: CreateCommentMessages.text.required })
    text: string;

  @IsMongoId({ message: CreateCommentMessages.offerId.invalid })
    offerId: string;
}
