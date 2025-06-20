import { UserType } from '../../../types/index.js';

export class CreateUserDto {
  public email: string;
  public name: string;
  public photo?: string;
  public password: string;
  public userType: UserType;
}
