import { EntityManager } from 'typeorm';
import { Channel as ChannelEntity } from '../entities';
import { Platform } from './Platform';

export type ChannelLike = string | number| ChannelEntity;

export class Channel {
  private static manager: EntityManager;

  static init(manager: EntityManager) {
    this.manager = manager;
  }

  static async get(identifier: ChannelLike): Promise<ChannelEntity> {
    return identifier instanceof ChannelEntity
      ? identifier
      : (await this.manager.find(ChannelEntity))
        .find(i => i.name === identifier || i.id === identifier || i.platformID === identifier);
  }

  static async getJoinable(platform: Platform): Promise<ChannelEntity[]> {
    return (await this.manager.find(ChannelEntity))
      .filter(i => i.platform === platform.name);
  }
}
