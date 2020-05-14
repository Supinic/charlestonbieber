import { getManager, getRepository } from 'typeorm';
import { Channel } from '../entities';
import { Platform } from '.';

export type ChannelLike = string | number| Channel;

export class ChannelManager {
  static async get(identifier: ChannelLike, platform: Platform): Promise<Channel> {
    return identifier instanceof Channel
      ? identifier
      : (await getRepository(Channel).find({ relations: ['broadcaster'] }))
        .find((i) => (
          (i.name === identifier || i.id === identifier || i.platformID === identifier)
            && i.platform === platform.name
        ));
  }

  static async getJoinable(platform: Platform): Promise<Channel[]> {
    return (await getManager().find(Channel))
      .filter((i) => i.platform === platform.name);
  }
}
