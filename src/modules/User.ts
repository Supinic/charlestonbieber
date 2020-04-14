import { User as UserEntity } from '../entities';
import { Connection } from 'typeorm';

export type UserLike = string | number | UserEntity;

export class User {
  private static connection: Connection;

  static init(connection: Connection) {
    this.connection = connection;
  }

  static async get(identifier: UserLike): Promise<UserEntity> {
    return (await this.connection.manager.find(UserEntity))
      .find(i => i.name === identifier || i.id === identifier || i.platformID === identifier);
  }
}
