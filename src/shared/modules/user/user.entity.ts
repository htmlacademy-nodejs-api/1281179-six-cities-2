import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';
import { CreateUserDto } from './dto/create-user.dto.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({ schemaOptions: { collection: 'users', timestamps: true } })
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: true, default: '' })
  public name: string;

  @prop({ required: false, default: '' })
  public photo?: string;

  @prop({ required: false, default: '' })
  private password?: string;

  @prop({ required: true, default: UserType.DEFAULT, enum: UserType })
  public userType: UserType;

  constructor(user: CreateUserDto) {
    super();
    this.email = user.email;
    this.name = user.name;
    this.photo = user.photo;
    this.userType = user.userType;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
