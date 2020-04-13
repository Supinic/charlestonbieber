import { Channel, User } from '../entities';
import { Platform, BanphraseTypes } from '.';
import { pajbot } from './Banphrase';
import escapeStringRegExp from 'escape-string-regexp';

export abstract class Command {
  abstract name: string;
  abstract aliases: string[];
  abstract cooldown: number;
  abstract data: object;

  abstract async execute(msg?: Input, ...args: string[]): Promise<Output>;

  async finalExecute(msg: Input, ...args: string[]): Promise<Output> {
    const result = await this.execute(msg, ...args);

    if (msg.channel.banphraseType === BanphraseTypes.PAJBOT) {
      const { banned, banphrase_data } = await pajbot(msg.channel, result.reply);

      if (banned) {
        let pattern: string;
        let flags = 'g';

        switch (banphrase_data.operator) {
          case 'regex':
            pattern = banphrase_data.phrase;
            break;
          
          case 'contains':
            pattern = escapeStringRegExp(banphrase_data.phrase);
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
    const commands: object = require('../commands');

    this.commands = Object.values(commands).map(command => new command());
  }

  static get(command: string) {
    return this.commands.find(i => i.name === command || i.aliases.includes(command));
  }
}

export interface Input {
  channel: Channel;
  user: User;
  platform: Platform;
  rawMessage: string;
  executedCommand: string;
  timestamp: Date;
}

export interface Output {
  reply: string;
  cooldown?: number;
  success?: boolean;
  noUsername?: boolean;
}
