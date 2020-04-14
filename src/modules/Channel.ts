import { Channel as ChannelEntity } from '../entities';
import { Connection } from 'typeorm';
import { Platform } from './Platform';

export type ChannelLike = string | number| ChannelEntity;

export class Channel {
  private static connection: Connection;
  
  static init(connection: Connection) {
    this.connection = connection;
  }

  static async get(identifier: ChannelLike): Promise<ChannelEntity> {
    return identifier instanceof ChannelEntity
      ? identifier
      : (await this.connection.manager.find(ChannelEntity))
        .find(i => i.name === identifier || i.id === identifier || i.platformID === identifier);
  }

  static async getJoinable(platform: Platform): Promise<ChannelEntity[]> {
    return (await this.connection.manager.find(ChannelEntity))
      .filter(i => i.platform === platform.name);
  }
}
