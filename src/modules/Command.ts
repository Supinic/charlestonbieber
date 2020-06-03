import type { Channel, User } from '../entities';
import type { Platform } from '.';

export abstract class Command {
  abstract name: string;
  abstract aliases: string[] | null;
  abstract cooldown: number;
  abstract data: Record<string, unknown> | null;
  abstract permission: Command.Permissions = Command.Permissions.EVERYONE;
  abstract description: string;
  abstract syntax: string[] | { [name: string]: string[]; } | null;

  abstract async execute(msg?: Command.Input, ...args: string[]): Promise<Command.Output>;

  checkPermission({ permission }: Command.Input): undefined | Command.Output {
    const permissionMap = new Map<Command.Permissions, string>()
      .set(Command.Permissions.BROADCASTER, 'the broadcaster')
      .set(Command.Permissions.TRUSTED, 'trusted users')
      .set(Command.Permissions.ADMIN, 'admins');

    if (permission < this.permission) {
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

    // eslint-disable-next-line @typescript-eslint/naming-convention
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
    permission: Permissions;
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
