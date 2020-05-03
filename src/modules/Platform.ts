import { getManager, getRepository } from 'typeorm';
import { Channel, User, AFK } from '../entities';
import { ChannelManager, ChannelLike, UserManager, Command, CooldownManager, Cooldown, MessageType, timeDelta } from '.';
import { cleanBanphrases } from './Banphrase';

export abstract class Platform {
  abstract name: Platform.Names;
  abstract client: unknown;

  abstract async message(channel: Channel, message: string): Promise<void>;
  abstract async pm(user: User, message: string): Promise<void>;

  static platforms: Platform[];

  static reload(): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const platforms: { [key: string]: new () => Platform } = require('../clients');

    this.platforms = Object.values(platforms).map(platform => new platform());
  }

  static get(name: Platform.Names): Platform {
    return this.platforms.find(i => i.name === name);
  }

  slowMode = false;

  async send(type: MessageType, to: Channel | User, message: string): Promise<void> {
    switch (type) {
      case 'message':
        message = await cleanBanphrases(message, to as Channel, this, true);

        this.message(to as Channel, message);
        break;

      case 'pm':
        message = await cleanBanphrases(message, null, this);

        this.pm(to as User, message);
        break;

      default:
        throw new Error('type must be "message" or "pm"');
    }
  }

  async handleMessage({ rawMessage, user, channel, timestamp, type }: RawInput): Promise<void> {
    const manager = getManager();

    channel = await ChannelManager.get(channel);

    let userObject = await UserManager.get(user.platformID);

    const afk = (await getRepository(AFK).find({ relations: ['user'] }))
      .find(i => i.active && i.user.id === userObject?.id);

    if (afk) {
      afk.active = false;
      afk.end = timestamp;

      await manager.save(afk);

      if (type === 'message') {
        await this.send(type, channel, `${afk.user.name} is no longer AFK: ${afk.message || '(no message)'} (${timeDelta(afk.start)})`);
      }
    }

    if (rawMessage.startsWith(process.env.PREFIX)) {
      const [cmd, ...args] = rawMessage
        .replace(/[\u034f\u2800\u{E0000}\u180e\ufeff\u2000-\u200d\u206D]/gu, '')
        .slice(process.env.PREFIX.length)
        .split(' ');
      const command = Command.get(cmd);

      if (!userObject) {
        userObject = new User();
        userObject.name = user.name;
        userObject.platformID = user.platformID;
        userObject.platform = this.name;
        userObject.location = [];

        await manager.save(userObject);
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

          await this.send(type, type === 'message' ? channel : userObject, reply);

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
  channel: ChannelLike;
  rawMessage: string;
  timestamp: Date;
  type: MessageType;
}
