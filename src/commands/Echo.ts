import { Command } from '../modules';

export class Echo extends Command {
  name = 'echo';
  aliases = ['say'];
  description = 'Writes a line into chat';
  syntax = ['text'];
  cooldown = 0;
  permission = Command.Permissions.TRUSTED;
  data = null;

  async execute(msg: Command.Input, ...args: string[]): Promise<Command.Output> {
    return {
      reply: args.join(' ') || 'xd',
      noUsername: true,
    };
  }
}
