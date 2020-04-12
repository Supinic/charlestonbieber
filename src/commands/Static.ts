import { Command, Input, Output, StaticCommand } from  '../modules';

export class Static extends Command {
  name = null;
  aliases = StaticCommand.commands.map(i => i.name);
  cooldown = 0;
  data = { commands: StaticCommand.commands };

  async execute({ executedCommand }: Input, ...args: string[]): Promise<Output> {
    const command = StaticCommand.get(executedCommand);

    return {
      reply: command.response,
      cooldown: command.cooldown,
    };
  }
}
