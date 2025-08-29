import { Expose } from 'class-transformer';

export class LoginUserRdo {
  @Expose()
  public email: string;

  @Expose()
  public token: string;
}
