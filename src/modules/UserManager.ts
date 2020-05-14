import { getManager } from 'typeorm';
import { User } from '../entities';
import { Platform } from '.';

export type UserLike = string | number | User;

export class UserManager {
  static async get(identifier: UserLike, platform: Platform): Promise<User> {
    return (await getManager().find(User))
      .find((i) => (
        (i.name === identifier || i.id === identifier || i.platformID === identifier)
          && i.platform === platform.name
      ));
  }
}

export const enum Levels {
  USER = 'user',
  TRUSTED = 'trusted',
  ADMIN = 'admin',
}
