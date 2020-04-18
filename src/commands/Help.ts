import { Input, Output, Permissions, Command } from '../modules';
import { PREFIX } from '../config.json';

export class Help extends Command {
  name = 'help';
  aliases = [];
  description = 'Get help about a command';
  syntax = ['command'];
  cooldown = 5000;
  permission = Permissions.EVERYONE;
  data = null;

  async execute(_msg: Input, command: string): Promise<Output> {
    if (!command) {
      return {
        reply: 'No command specified',
        cooldown: 2500,
        success: false,
      };
    }

    const cmd = Command.get(command);

    if (!command || !cmd.name) {
      return {
        reply: 'Could not find that command',
        cooldown: 2500,
        success: false,
      };
    }

    const aliases = cmd.aliases.length
      ? `(${cmd.aliases.join(', ')})`
      : '';

    return { reply: `${PREFIX}${cmd.name} ${aliases} ${cmd.syntax.map(i => `<${i}>`)} | ${cmd.description} | Cooldown: ${cmd.cooldown / 1000} seconds` };
  }
}
