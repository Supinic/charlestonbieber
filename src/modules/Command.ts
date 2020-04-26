import escapeStringRegexp from 'escape-string-regexp';
import { Channel, User } from '../entities';
import { Platform, BanphraseTypes } from '.';
import { Pajbot } from './Banphrase';

export enum Permissions {
  OWNER = 1,
  BROADCASTER = 2,
  EVERYONE = 0,
}

export abstract class Command {
  abstract name: string;
  abstract aliases: string[] = [];
  abstract cooldown: number;
  abstract data: object = null;
  abstract permission: Permissions = Permissions.EVERYONE;
  abstract description: string;
  abstract syntax: string[];

  abstract async execute(msg?: Input, ...args: string[]): Promise<Output>;

  checkPermission(msg: Input): Output {
    switch (this.permission) {
      case Permissions.BROADCASTER:
        if (msg.user.platformID !== msg.channel.platformID) {
          return { reply: 'Only the broadcaster can use this command.' };
        }
        break;

      case Permissions.OWNER:
        if (msg.user.id !== 1) {
          return { reply: 'Only my owner can use this command.' };
        }
        break;

      case Permissions.EVERYONE:
      default:
        break;
    }
  }

  async finalExecute(msg: Input, ...args: string[]): Promise<Output> {
    const notPermitted = this.checkPermission(msg);

    if (notPermitted) {
      return notPermitted;
    }

    const result = await this.execute(msg, ...args);

    result.reply = String(result.reply).replace(/(\s+)|\n/g, ' ');

    if (msg.type === 'message' && msg.channel.banphraseType === BanphraseTypes.PAJBOT) {
      const { banned, banphrase_data } = await Pajbot.checkBanphrase(msg.channel, result.reply);

      if (banned) {
        let pattern: string;
        let flags = 'g';

        switch (banphrase_data.operator) {
          case 'regex':
            pattern = banphrase_data.phrase;
            break;

          case 'contains':
            pattern = escapeStringRegexp(banphrase_data.phrase);
            break;
        }

        if (!banphrase_data.case_sensitive) {
          flags += 'i';
        }

        result.reply = result.reply.replace(new RegExp(pattern, flags), '[BANNED]');
      }
    }

    if (!result.noUsername) {
      result.reply = `${msg.user.name}, ${result.reply}`;
    }

    return result;
  }

  static commands: Command[];

  static reload() {
    const commands: { [key: string]: new () => Command } = require('../commands');

    this.commands = Object.values(commands).map(command => new command());
  }

  static get(command: string) {
    return this.commands.find(i => i.name === command || i.aliases.includes(command));
  }
}

export type MessageType = 'message' | 'pm';

export interface Input {
  channel: Channel;
  user: User;
  platform: Platform;
  rawMessage: string;
  executedCommand: string;
  timestamp: Date;
  type: MessageType;
}

export interface Output {
  reply: string;
  cooldown?: number;
  success?: boolean;
  noUsername?: boolean;
}
