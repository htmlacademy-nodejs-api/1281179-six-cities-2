import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserService } from './user-service.interface.js';
import { UserEntity, UserModel } from './user.entity.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/components.enum.js';
import { Logger } from '../../libs/logger/index.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(@inject(Components.Logger) private readonly logger: Logger) {}
  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);
    const result = await UserModel.create(user);

    this.logger.info(`Created user ${user.email}`);
    return result;
  }

  findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    throw new Error('Method not implemented.');
  }

  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    throw new Error('Method not implemented.');
  }
}
