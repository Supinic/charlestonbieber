import { Input, Output, Permissions, Command } from '../modules';

export class Echo extends Command {
  name = 'echo';
  aliases = ['say'];
  cooldown = 0;
  permission = Permissions.OWNER;
  data = null;

  async execute(_msg: Input, ...args: string[]): Promise<Output> {
    return {
      reply: args.join(' ') || 'xd',
      noUsername: true,
    };
  }
}
