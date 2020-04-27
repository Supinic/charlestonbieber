import { getManager } from 'typeorm';
import { User as UserEntity } from '../entities';

export type UserLike = string | number | UserEntity;

export class User {
  static async get(identifier: UserLike): Promise<UserEntity> {
    return (await getManager().find(UserEntity))
      .find(i => i.name === identifier || i.id === identifier || i.platformID === identifier);
  }
}
