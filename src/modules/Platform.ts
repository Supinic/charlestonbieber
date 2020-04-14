import { Channel as ChannelEntity, User as UserEntity } from '../entities';
import { Channel, ChannelLike, User, Command } from '.';

import { PREFIX } from '../config.json';
import { getConnection } from 'typeorm';

export enum PlatformNames {
  TWITCH = 'Twitch',
}

export abstract class Platform {
  abstract name: PlatformNames;
  abstract client: any;

  abstract async message(channel: ChannelEntity, message: string): Promise<void>;
  abstract async pm(user: UserEntity, message: string): Promise<void>;

  static platforms: Platform[];

  static reload() {
    const platforms: { [key: string]: new () => Platform } = require('../clients');

    this.platforms = Object.values(platforms).map(platform => new platform());
  }

  static get(name: PlatformNames): Platform {
    return this.platforms.find(i => i.name === name);
  }

  cooldowns = new Set<string>();
  slowMode = false;

  async handleCommand(type: 'message' | 'pm', { rawMessage, user, channel, timestamp }: RawInput) {
    if (rawMessage.startsWith(PREFIX)) {
      const [cmd, ...args] = rawMessage.slice(1).split(' ');
      const command = Command.get(cmd);

      channel = Channel.get(channel);

      let userObject = User.get(user.platformID);

      if (!userObject) {
        userObject = new UserEntity();
        userObject.name = user.name;
        userObject.platformID = user.platformID;
        userObject.platform = this.name;
        userObject.location = [];

        getConnection().manager.save(userObject);
      }

      if (command && !this.slowMode) {
        const cooldownString = [type === 'pm' ? userObject.id : channel.id, command.name || cmd].join();

        if (!this.cooldowns.has(cooldownString)) {
          const { reply, cooldown } = await command.finalExecute({
            user: userObject,
            channel,
            timestamp,
            rawMessage,
            platform: this,
            executedCommand: cmd,
          }, ...args);
  
          if (type === 'message') {
            await this.message(channel, reply);
          } else {
            await this.pm(userObject, reply);
          }
  
          this.slowMode = true;
          this.cooldowns.add(cooldownString);
  
          setTimeout(() => this.slowMode = false, 1000);
          setTimeout(() => this.cooldowns.delete(cooldownString), cooldown || command.cooldown);
        }
      }
    }
  }
}

export interface RawInput {
  user: {
    name: string;
    platformID: string;
  };
  channel: ChannelLike,
  rawMessage: string;
  timestamp: Date;
}
