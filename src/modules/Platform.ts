import { getManager } from 'typeorm';
import { Channel, User } from '../entities';
import { ChannelManager, ChannelLike, UserManager, Command, CooldownManager, Cooldown, MessageType } from '.';
import { PREFIX } from '../config.json';

export abstract class Platform {
  abstract name: Platform.Names;
  abstract client: any;

  abstract async message(channel: Channel, message: string): Promise<void>;
  abstract async pm(user: User, message: string): Promise<void>;

  static platforms: Platform[];

  static reload() {
    const platforms: { [key: string]: new () => Platform } = require('../clients');

    this.platforms = Object.values(platforms).map(platform => new platform());
  }

  static get(name: Platform.Names): Platform {
    return this.platforms.find(i => i.name === name);
  }

  slowMode = false;

  async handleCommand({ rawMessage, user, channel, timestamp, type }: RawInput) {
    if (rawMessage.startsWith(PREFIX)) {
      const [cmd, ...args] = rawMessage
        .replace(/[\u034f\u2800\u{E0000}\u180e\ufeff\u2000-\u200d\u206D]/gu, '')
        .slice(PREFIX.length)
        .split(' ');
      const command = Command.get(cmd);

      channel = await ChannelManager.get(channel);

      let userObject = await UserManager.get(user.platformID);

      if (!userObject) {
        userObject = new User();
        userObject.name = user.name;
        userObject.platformID = user.platformID;
        userObject.platform = this.name;
        userObject.location = [];

        await getManager().save(userObject);
      }

      if (command && !this.slowMode) {
        const cooldownObject: Cooldown = {
          executedBy: type === 'message' ? channel : userObject,
          command,
        };

        if (!CooldownManager.has(cooldownObject)) {
          const { reply, cooldown } = await command.finalExecute({
            user: userObject,
            channel,
            timestamp,
            rawMessage,
            type,
            platform: this,
            executedCommand: cmd,
          }, ...args);

          if (cooldown) {
            cooldownObject.cooldown = cooldown;
          }

          if (type === 'message') {
            await this.message(channel, reply);
          } else {
            await this.pm(userObject, reply);
          }

          this.slowMode = true;
          CooldownManager.add(cooldownObject);

          setTimeout(() => this.slowMode = false, 1000);
        }
      }
    }
  }
}

export namespace Platform {
  export enum Names {
    TWITCH = 'Twitch',
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
  type: MessageType;
}
