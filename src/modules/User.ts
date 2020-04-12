import { User as UserEntity } from '../entities';
import { Connection } from 'typeorm';

export type UserLike = string | number | UserEntity;

export class User {
  static users: UserEntity[];
  
  static async reload(connection: Connection) {
    this.users = await connection.manager.find(UserEntity);
  }

  static get(identifier: UserLike): UserEntity {
    return identifier instanceof UserEntity
      ? identifier
      : this.users.find(i => i.name === identifier || i.id === identifier || i.platformID === identifier);
  }
}
