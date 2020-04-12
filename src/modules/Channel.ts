import { Channel as ChannelEntity } from '../entities';
import { Connection } from 'typeorm';

export type ChannelLike = string | number| ChannelEntity;

export class Channel {
  static channels: ChannelEntity[];
  
  static async reload(connection: Connection) {
    this.channels = await connection.manager.find(ChannelEntity);
  }

  static get(identifier: ChannelLike): ChannelEntity {
    return identifier instanceof ChannelEntity
      ? identifier
      : this.channels.find(i => i.name === identifier || i.id === identifier || i.platformID === identifier);
  }
}
