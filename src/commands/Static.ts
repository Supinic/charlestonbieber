import { Command, Input, Output, StaticCommandManager, Permissions } from '../modules';

export class Static extends Command {
  name = null;
  aliases = StaticCommandManager.commands.map((i) => i.name);
  syntax = [];
  description = '';
  cooldown = 0;
  data = { commands: StaticCommandManager.commands };
  permission = Permissions.EVERYONE;

  async execute({ executedCommand }: Input): Promise<Output> {
    const command = StaticCommandManager.get(executedCommand);

    return {
      reply: command.response,
      cooldown: command.cooldown,
    };
  }
}
