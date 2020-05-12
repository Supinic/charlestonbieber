import { getManager } from 'typeorm';
import { Command } from '../modules';

export class Set extends Command {
  name = 'set';
  aliases = null;
  syntax = ['variable', 'value'];
  description = 'Allows users/the bot owner to customize their variables within the bot';
  cooldown = 10000;
  data = null;
  permission = Command.Permissions.EVERYONE;

  async execute(msg: Command.Input, variable: 'prefix', ...args: string[]): Promise<Command.Output> {
    if (!variable) {
      return {
        reply: 'A variable must be provided',
        cooldown: 2500,
        success: false,
      };
    }

    if (args.length === 0) {
      return {
        reply: 'A value must be provided',
        cooldown: 2500,
        success: false,
      };
    }

    const manager = getManager();

    switch (variable) {
      case 'prefix': {
        if (msg.user.id !== 1) {
          return;
        }

        const { channel } = msg;
        channel.prefix = args.join(' ');

        await manager.save(channel);

        return { reply: `Prefix for this channel has been successfully set to ${channel.prefix}` };
      }

      default:
        return {
          reply: 'That variable doesn\'t exist',
          success: false,
          cooldown: 5000,
        };
    }
  }
}
