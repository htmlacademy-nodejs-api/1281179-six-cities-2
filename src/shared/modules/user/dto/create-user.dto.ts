import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { UserType } from '../../../types/index.js';
import { CreateUserMessages } from './create-user.messages.js';

export class CreateUserDto {
  @IsEmail({}, { message: CreateUserMessages.email.invalid })
  @IsNotEmpty({ message: CreateUserMessages.email.required })
  public email: string;

  @IsString({ message: CreateUserMessages.name.required })
  @IsNotEmpty({ message: CreateUserMessages.name.required })
  @Length(1, 15, { message: CreateUserMessages.name.minLength })
  public name: string;

  @IsString({ message: CreateUserMessages.password.required })
  @IsOptional()
  @Length(6, 12, { message: CreateUserMessages.password.minLength })
  @MaxLength(12, { message: CreateUserMessages.password.maxLength })
  public photo?: string;

  @IsString({ message: CreateUserMessages.password.required })
  @IsNotEmpty({ message: CreateUserMessages.password.required })
  @Length(6, 12, { message: CreateUserMessages.password.minLength })
  @MaxLength(12, { message: CreateUserMessages.password.maxLength })
  public password: string;

  @IsEnum(UserType, { message: CreateUserMessages.userType.invalid })
  @IsOptional()
  public userType?: UserType;
}
