/* eslint-disable @typescript-eslint/naming-convention */
import { Misia as KotMisia } from './types';
import { Command, addInvisibleChars } from '../modules';
import { misia } from '../modules/GotInstances';

export class Misia extends Command {
  name = 'misia';
  aliases = ['kot', 'kotmisia'];
  cooldown = 15000;
  permission = Command.Permissions.EVERYONE;
  description = 'A command to interact with Mm2🅱L\'s API.';
  syntax = ['command', 'args?'];
  data = null;

  async execute(
    msg: Command.Input,
    command: 'test' | 'suggestions',
    ...args: string[]
  ): Promise<Command.Output> {
    switch (command) {
      case 'test':
        return { reply: await misia(command).text() };

      case 'suggestions':
        switch (args[0] as 'stats') {
          case 'stats': {
            const { top_users }: KotMisia.Suggestion.Stats = await misia('suggestions/stats').json();
            const topUsers = top_users
              .map(({ name, count }, index) => `#${index + 1}: ${addInvisibleChars(name)} (${count})`)
              .join(' | ');

            return { reply: topUsers };
          }
        }
        break;

      default:
        return {
          reply: 'That command does not exist',
          cooldown: 5000,
          success: false,
        };
    }
  }
}
