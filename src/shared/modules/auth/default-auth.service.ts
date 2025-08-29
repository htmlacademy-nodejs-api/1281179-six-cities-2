import { inject, injectable } from 'inversify';
import crypto from 'node:crypto';
import { AuthService } from './auth-service.interface.js';
import { TokenPayload } from './types/TokenPayload.js';
import { Components } from '../../types/components.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { UserService } from '../user/user-service.interface.js';
import { Config } from '../../libs/config/config.interface.js';
import { RestSchema } from '../../libs/config/rest.schema.js';
import { UserEntity } from '../user/user.entity.js';
import { SignJWT } from 'jose';
import { LoginUserDto } from '../user/dto/login-user.dto.js';
import { HttpError } from '../../libs/rest/index.js';
import { StatusCodes } from 'http-status-codes';
import { UserNotFoundException } from './errors/index.js';
import { UserPasswordIncorrectException } from './errors/user-password-incorrect.exception.js';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger,
    @inject(Components.UserService)
    private readonly userService: UserService,
    @inject(Components.RestConfig)
    private readonly config: Config<RestSchema>,
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ')[1],
    };
    this.logger.info(`Create token for ${user.email}`);
    const token = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: this.config.get('JWT_ALGORITHM')})
      .setIssuedAt()
      .setExpirationTime(this.config.get('JWT_EXPIRES_IN'))
      .sign(secretKey);
    this.logger.info(`Token created for ${user.email}. Token: ${token}`);

    return token;
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UserNotFoundException();
    }
    const isPasswordValid = await user.verifyPassword(dto.password, this.config.get('SALT'));
    if (!isPasswordValid) {
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}
