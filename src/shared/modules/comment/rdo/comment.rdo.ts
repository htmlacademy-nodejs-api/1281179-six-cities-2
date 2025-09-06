import { Expose, Transform, Type } from 'class-transformer';
import { CommentEntity } from '../comment.entity.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class CommentRdo {
  @Expose()
  @Transform(({ obj }: { obj: CommentEntity }) => {
    if (obj?._id) {
      return String(obj._id);
    }
    return undefined;
  })
  public id!: string;

  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose()
  public createdAt!: string;

  @Expose()
  public updatedAt!: string;

  @Expose({ name: 'authorId'})
  @Type(() => UserRdo)
  public user: UserRdo;
}
