import { Command } from '../modules';

export class Echo extends Command {
  name = 'echo';
  aliases = ['say'];
  description = 'Writes a line into chat';
  syntax = ['text'];
  cooldown = 0;
  permission = Command.Permissions.OWNER;
  data = null;

  async execute(_msg: Command.Input, ...args: string[]): Promise<Command.Output> {
    return {
      reply: args.join(' ') || 'xd',
      noUsername: true,
    };
  }
}
