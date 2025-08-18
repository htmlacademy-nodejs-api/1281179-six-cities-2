import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserEntity } from './user.entity.js';
import { DocumentExist } from '../../types/document-exist.interface.js';

export interface UserService extends DocumentExist {
  create(dto: CreateUserDto, salt:string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findUserById(id: string): Promise<DocumentType<UserEntity> | null>;
  findAll: () => Promise<DocumentType<UserEntity>[]> | null;
  comparePassword(password: string, hash: string, salt: string): Promise<boolean>;
  deleteById(id: string): Promise<number>;
  updateById(id: string, dto: CreateUserDto): Promise<DocumentType<UserEntity> | null>;
}
