import { User, UserType } from '../../types/user.type.js';

export class UserEntity implements User {
  public email: string;
  public name: string;
  public photo?: string;
  public password: string;
  public userType: UserType;
}
