import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({ schemaOptions: { collection: 'users', timestamps: true } })
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: true })
  public name: string;

  @prop({ required: false, default: '' })
  public photo?: string;

  @prop({ required: true })
  private _password: string;

  @prop({ required: true })
  public userType: UserType;

  constructor(user: User) {
    super();
    this.email = user.email;
    this.name = user.name;
    this.photo = user.photo;
    this.userType = user.userType;
  }

  public set password(password: string) {
    this._password = createSHA256(password, 'salt');
  }

  public get password():string {
    return this._password;
  }
}

export const UserModel = getModelForClass(UserEntity);
