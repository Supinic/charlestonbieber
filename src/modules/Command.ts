import { Channel, User } from '../entities';
import { Platform } from '.';

export abstract class Command {
  abstract name: string;
  abstract aliases: string[] | null;
  abstract cooldown: number;
  abstract data: object | null;
  abstract permission: Command.Permissions = Command.Permissions.EVERYONE;
  abstract description: string;
  abstract syntax: string[] | null;

  abstract async execute(msg?: Command.Input, ...args: string[]): Promise<Command.Output>;

  checkPermission(msg: Command.Input): Command.Output | null {
    switch (this.permission) {
      case Command.Permissions.BROADCASTER:
        if (msg.user.platformID !== msg.channel.platformID) {
          return { reply: 'Only the broadcaster can use this command.' };
        }
        break;

      case Command.Permissions.OWNER:
        if (msg.user.id !== 1) {
          return { reply: 'Only my owner can use this command.' };
        }
        break;

      case Command.Permissions.EVERYONE:
      default:
        break;
    }
  }

  async finalExecute(msg: Command.Input, ...args: string[]): Promise<Command.Output> {
    const notPermitted = this.checkPermission(msg);

    if (notPermitted) {
      return notPermitted;
    }

    const result = await this.execute(msg, ...args);

    if (!result) {
      return;
    }

    if (!result?.noUsername) {
      result.reply = `${msg.user.name}, ${result.reply}`;
    }

    return result;
  }

  static commands: Command[];

  static async load(): Promise<void> {
    const commands = await import('../commands');

    this.commands = Object.values(commands).map((Cmd) => new Cmd());
  }

  static get(command: string): Command {
    return this.commands.find((i) => i.name === command || i.aliases?.includes?.(command));
  }
}

export type MessageType = 'message' | 'pm';

export namespace Command {
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

  export enum Permissions {
    OWNER = 1,
    BROADCASTER = 2,
    EVERYONE = 0,
  }
}
