import { Channel, User } from '../entities';
import { Platform, PermissionMultiplexer } from '.';

export abstract class Command {
  abstract name: string;
  abstract aliases: string[] | null;
  abstract cooldown: number;
  abstract data: object | null;
  abstract permission: Command.Permissions = Command.Permissions.EVERYONE;
  abstract description: string;
  abstract syntax: string[] | null;

  abstract async execute(msg?: Command.Input, ...args: string[]): Promise<Command.Output>;

  checkPermission(msg: Command.Input): undefined | Command.Output {
    const permissionLevel = PermissionMultiplexer.getUserPermissions(msg.user, msg.channel);
    const permissionMap = new Map<Command.Permissions, string>()
      .set(Command.Permissions.BROADCASTER, 'the broadcaster')
      .set(Command.Permissions.TRUSTED, 'trusted users')
      .set(Command.Permissions.ADMIN, 'admins');

    if (permissionLevel < this.permission) {
      return { reply: `Only ${permissionMap.get(this.permission)} can use this command!` };
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

  /* eslint-disable no-bitwise */
  export enum Permissions {
    EVERYONE = 0,
    BROADCASTER = 1 << 0,
    TRUSTED = 1 << 1,
    ADMIN = 1 << 2,
  }
}
