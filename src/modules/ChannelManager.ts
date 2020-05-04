import { getManager } from 'typeorm';
import { Channel } from '../entities';
import { Platform } from './Platform';

export type ChannelLike = string | number| Channel;

export class ChannelManager {
  static async get(identifier: ChannelLike): Promise<Channel> {
    return identifier instanceof Channel
      ? identifier
      : (await getManager().find(Channel))
        .find((i) => i.name === identifier || i.id === identifier || i.platformID === identifier);
  }

  static async getJoinable(platform: Platform): Promise<Channel[]> {
    return (await getManager().find(Channel))
      .filter((i) => i.platform === platform.name);
  }
}
