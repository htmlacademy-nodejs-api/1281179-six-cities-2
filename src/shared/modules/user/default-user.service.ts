import { DocumentType, types } from '@typegoose/typegoose';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/components.enum.js';
import { Logger } from '../../libs/logger/index.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger,

    @inject(Components.UserModel)
    private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string) {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);
    const result = await this.userModel.create(user);

    this.logger.info(`Created user ${user.email}`);
    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOrCreate(dto: CreateUserDto, salt: string) {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      return existingUser;
    }

    return this.create(dto, salt);
  }
}
