import { Channel, User } from '../entities';
import { Platform } from '.';

export abstract class Command {
  abstract name: string;
  abstract aliases: string[];
  abstract cooldown: number;
  abstract data: object;

  abstract async execute(msg?: Input, ...args: string[]): Promise<Output>;

  async finalExecute(msg: Input, ...args: string[]): Promise<Output> {
    const result = await this.execute(msg, ...args);

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
