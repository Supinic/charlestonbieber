import { Command } from '../modules';

export class Help extends Command {
  name = 'help';
  aliases = ['commands'];
  description = 'Get help about a command';
  syntax = ['command'];
  cooldown = 5000;
  permission = Command.Permissions.EVERYONE;
  data = null;

  async execute(
    { executedCommand, channel: { prefix } }: Command.Input,
    command: string,
  ): Promise<Command.Output> {
    if (!command || executedCommand === 'commands') {
      const commands = Command.commands
        .map((i) => i.name)
        .filter((i) => i !== null)
        .join(', ');

      return { reply: `Available commands: ${commands}` };
    }

    const cmd = Command.get(command);

    if (!cmd || !cmd.name) {
      return {
        reply: 'Could not find that command',
        cooldown: 2500,
        success: false,
      };
    }

    const syntax = cmd.syntax?.map?.((i) => `<${i}>`) || '';
    const cooldown = cmd.cooldown / 1000;
    const aliases = cmd.aliases
      ? `(${cmd.aliases.join(', ')})`
      : '';

    return { reply: `${prefix}${cmd.name} ${aliases} ${syntax} | ${cmd.description} | Cooldown: ${cooldown} seconds` };
  }
}
