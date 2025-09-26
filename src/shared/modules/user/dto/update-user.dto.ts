import { UserType } from '../../../types/index.js';

export class UpdateUserDto {
  public email?: string;
  public name?: string;
  public password?: string;
  public userType?: UserType;
  public avatarPath?: string;
}
