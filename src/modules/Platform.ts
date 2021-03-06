import { getManager, getRepository } from 'typeorm';
import { Channel, User, AFK } from '../entities';
import {
  PermissionMultiplexer,
  ChannelManager,
  ChannelLike,
  UserManager,
  Command,
  CooldownManager,
  Cooldown,
  MessageType,
  timeDelta,
  cleanBanphrases,
} from '.';

export abstract class Platform {
  abstract name: Platform.Names;
  abstract client: unknown;

  abstract async message(channel: Channel, message: string): Promise<void>;
  abstract async pm(user: User, message: string): Promise<void>;

  static platforms: Platform[];

  static async load(): Promise<void> {
    const platforms = await import('../clients');

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.platforms = Object.values(platforms).map((Client) => new Client());
  }

  static get(name: Platform.Names): Platform {
    return this.platforms.find((i) => i.name === name);
  }

  slowMode = false;

  async send(type: MessageType, to: Channel | User, message: string): Promise<void> {
    let msg = message;

    switch (type) {
      case 'message':
        msg = await cleanBanphrases(msg, to as Channel, this, true);

        this.message(to as Channel, msg);
        break;

      case 'pm':
        msg = await cleanBanphrases(msg, null, this);

        this.pm(to as User, msg);
        break;

      default:
        throw new Error('type must be "message" or "pm"');
    }
  }

  async handleMessage({
    rawMessage,
    user,
    channel,
    timestamp = new Date(),
    type,
  }: RawInput): Promise<void> {
    const channelObject = await ChannelManager.get(channel, this);
    let userObject = await UserManager.get(user.platformID, this);

    const afk = (await getRepository(AFK).find({ relations: ['user'] }))
      .find((i) => i.active && i.user.id === userObject?.id);
    const manager = getManager();

    if (afk) {
      afk.active = false;
      afk.end = timestamp;

      await manager.save(afk);

      if (type === 'message') {
        await this.send(type, channelObject, `${afk.user.name} is no longer AFK: ${afk.message || '(no message)'} (${timeDelta(afk.start)})`);
      }
    }

    if (
      rawMessage.startsWith(channelObject?.prefix)
      || (type === 'pm' && rawMessage.startsWith(process.env.DEFAULT_PREFIX))
    ) {
      const [cmd, ...args] = rawMessage
        .replace(/[\u034f\u2800\u{E0000}\u180e\ufeff\u2000-\u200d\u206D]/gu, '')
        .slice(channelObject?.prefix?.length ?? process.env.DEFAULT_PREFIX.length)
        .split(' ');
      const command = Command.get(cmd);

      if (command && !this.slowMode) {
        const cooldownObject: Cooldown = {
          executedBy: type === 'message' ? channelObject : userObject,
          command,
        };

        if (!CooldownManager.has(cooldownObject)) {
          if (!userObject) {
            userObject = new User();
            userObject.name = user.name;
            userObject.platformID = user.platformID;
            userObject.platform = this.name;

            await manager.save(userObject);
          }

          const result = await command.finalExecute({
            user: userObject,
            channel: channelObject,
            platform: this,
            executedCommand: cmd,
            permission: PermissionMultiplexer.getUserPermissions(userObject, channelObject),
            timestamp,
            rawMessage,
            type,
          }, ...args);

          if (!result) {
            return;
          }

          const { reply, cooldown } = result;

          if (cooldown) {
            cooldownObject.cooldown = cooldown;
          }

          await this.send(type, type === 'message' ? channelObject : userObject, reply);

          this.slowMode = true;
          CooldownManager.add(cooldownObject);

          setTimeout(() => {
            this.slowMode = false;
          }, 1000);
        }
      }
    }
  }
}

export namespace Platform {
  export enum Names {
    TWITCH = 'Twitch',
    MIXER = 'Mixer',
  }
}

export interface RawInput {
  user: {
    name: string;
    platformID: string;
  };
  channel: ChannelLike;
  rawMessage: string;
  timestamp?: Date;
  type: MessageType;
}
