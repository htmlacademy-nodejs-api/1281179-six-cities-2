import { defaultClasses, getModelForClass, prop } from '@typegoose/typegoose';
import { User, UserType } from '../../types/user.type.js';

export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: true })
  public name: string;

  @prop({ required: false, default: '' })
  public photo?: string;

  @prop({ required: true })
  public password: string;

  @prop({ required: true })
  public userType: UserType;
}

export const UserModel = getModelForClass(UserEntity);
