import { getManager } from 'typeorm';
import { AFK } from '../entities';
import { Command } from '../modules';

export class AwayFromKeyboard extends Command {
  name = 'awayfromkeyboard';
  aliases = ['afk'];
  cooldown = 5000;
  description = 'Flags you as AFK';
  syntax = ['message?'];
  permission = Command.Permissions.EVERYONE;
  data = null;

  async execute({ timestamp, user }: Command.Input, ...args: string[]): Promise<Command.Output> {
    const afk = new AFK();

    if (args.length > 0) {
      afk.message = args.join(' ');
    }

    afk.start = timestamp;
    afk.user = user;

    await getManager().save(afk);

    return {
      reply: `${afk.user.name} is now AFK: ${afk.message || '(no message)'}`,
      noUsername: true,
    };
  }
}
