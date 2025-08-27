import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@modelOptions({ schemaOptions: { collection: 'users', timestamps: true } })
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, default: '' })
  public id: string;

  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: true, default: '' })
  public name: string;

  @prop({ required: false, default: '' })
  public photo?: string;

  @prop({ required: false, default: '' })
  private password?: string;

  @prop({ required: false, default: UserType.DEFAULT, enum: UserType })
  public userType: UserType;

  constructor(user: CreateUserDto) {
    super();
    this.email = user.email;
    this.name = user.name;
    this.photo = user.photo;
    this.userType = user.userType ?? UserType.DEFAULT;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
