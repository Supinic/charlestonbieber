import { EntityManager } from 'typeorm';
import { User as UserEntity } from '../entities';

export type UserLike = string | number | UserEntity;

export class User {
  private static manager: EntityManager;

  static init(manager: EntityManager) {
    this.manager = manager;;
  }

  static async get(identifier: UserLike): Promise<UserEntity> {
    return (await this.manager.find(UserEntity))
      .find(i => i.name === identifier || i.id === identifier || i.platformID === identifier);
  }
}
