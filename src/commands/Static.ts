import { Command, StaticCommandManager } from '../modules';

export class Static extends Command {
  name = null;
  aliases = StaticCommandManager.commands.map((i) => i.name);
  syntax = [];
  description = '';
  cooldown = 0;
  data = { commands: StaticCommandManager.commands };
  permission = Command.Permissions.EVERYONE;

  async execute({ executedCommand }: Command.Input): Promise<Command.Output> {
    const command = StaticCommandManager.get(executedCommand);

    return {
      reply: command.response,
      cooldown: command.cooldown,
    };
  }
}
