import { Command } from '../modules';

export class Help extends Command {
  name = 'help';
  aliases = ['commands'];
  description = 'Get help about a command';
  syntax = ['command'];
  cooldown = 5000;
  permission = Command.Permissions.EVERYONE;
  data = null;

  async execute({ executedCommand }: Command.Input, command: string): Promise<Command.Output> {
    if (executedCommand === 'commands') {
      const commands = Command.commands
        .map(i => i.name)
        .filter(i => i !== null)
        .join(', ');

      return { reply: `Available commands: ${commands}` };
    }

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

    return { reply: `${process.env.PREFIX}${cmd.name} ${aliases} ${cmd.syntax.map(i => `<${i}>`)} | ${cmd.description} | Cooldown: ${cmd.cooldown / 1000} seconds` };
  }
}
