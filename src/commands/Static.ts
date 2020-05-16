import { getManager } from 'typeorm';
import { StaticCommand } from '../entities';
import { Command, StaticCommandManager, getOption } from '../modules';

export class Static extends Command {
  name = null;
  aliases = [
    'add',
    'edit',
    'remove',
    ...StaticCommandManager.commands.map((i) => i.name),
  ];
  syntax = null;
  description = '';
  cooldown = 0;
  data = { commands: StaticCommandManager.commands };
  permission = Command.Permissions.EVERYONE;

  async execute(msg: Command.Input, ...args: string[]): Promise<Command.Output> {
    const manager = getManager();

    switch (msg.executedCommand) {
      case 'add': {
        if (msg.permission < Command.Permissions.TRUSTED) {
          return;
        }

        const name = getOption('name', args, true);

        if (!name) {
          return {
            reply: 'A name is required',
            success: false,
          };
        }

        if (this.data.commands.some((i) => i.name === name)) {
          return {
            reply: 'That command already exists!',
            success: false,
          };
        }

        const staticCommand = new StaticCommand();
        staticCommand.name = name;

        const cooldown = getOption('cooldown', args, true);
        staticCommand.cooldown = cooldown ? Number(cooldown) * 1000 : 0;

        console.debug(staticCommand.cooldown);

        if (args.length === 0) {
          return {
            reply: 'A response is required',
            success: false,
          };
        }

        staticCommand.response = args.join(' ');
        await manager.save(staticCommand);

        this.aliases.push(staticCommand.name);
        this.data.commands.push(staticCommand);

        return { reply: 'Command was added successfully.' };
      }

      case 'edit': {
        if (msg.permission < Command.Permissions.TRUSTED) {
          return;
        }

        const name = getOption('name', args, true);

        if (!name) {
          return {
            reply: 'A name is required',
            success: false,
          };
        }

        const staticCommand = this.data.commands.find((i) => i.name === name);

        if (!staticCommand) {
          return {
            reply: 'Could not find that command',
            success: false,
          };
        }

        const cooldown = getOption('cooldown', args, true);

        if (cooldown) {
          staticCommand.cooldown = Number(cooldown);
        }

        if (args.length > 0) {
          staticCommand.response = args.join(' ');
        }

        await manager.save(staticCommand);

        return { reply: 'Command was edited successfully' };
      }

      case 'remove': {
        if (msg.permission < Command.Permissions.TRUSTED) {
          return;
        }

        if (args.length === 0) {
          return {
            reply: 'Name of the command must be provided',
            success: false,
          };
        }

        const [name] = args;
        const staticCommand = this.data.commands.find((i) => i.name === name);

        if (!staticCommand) {
          return {
            reply: 'Could not find that command',
            success: false,
          };
        }

        this.data.commands = this.data.commands.filter((i) => i.name !== name);
        await manager.remove(staticCommand);

        return { reply: 'Command was successfully removed.' };
      }

      default: {
        const staticCommand = this.data.commands.find((i) => i.name === msg.executedCommand);

        return {
          reply: staticCommand.response,
          cooldown: staticCommand.cooldown,
        };
      }
    }
  }
}
