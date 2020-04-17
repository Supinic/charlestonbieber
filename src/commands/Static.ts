import { Command, Input, Output, StaticCommand, Permissions } from '../modules';

export class Static extends Command {
  name = null;
  aliases = StaticCommand.commands.map((i) => i.name);
  cooldown = 0;
  data = { commands: StaticCommand.commands };
  permission = Permissions.EVERYONE;

  async execute({ executedCommand }: Input): Promise<Output> {
    const command = StaticCommand.get(executedCommand);

    return {
      reply: command.response,
      cooldown: command.cooldown,
    };
  }
}
