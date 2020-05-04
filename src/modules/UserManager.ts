import { getManager } from 'typeorm';
import { User } from '../entities';

export type UserLike = string | number | User;

export class UserManager {
  static async get(identifier: UserLike): Promise<User> {
    return (await getManager().find(User))
      .find((i) => i.name === identifier || i.id === identifier || i.platformID === identifier);
  }
}
