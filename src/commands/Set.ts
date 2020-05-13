import { getManager } from 'typeorm';
import {
  Command,
  UserManager,
  PermissionMultiplexer,
  Levels,
} from '../modules';

export class Set extends Command {
  name = 'set';
  aliases = null;
  syntax = ['variable', 'value'];
  description = 'Allows users/the bot owner to customize their variables within the bot';
  cooldown = 10000;
  data = null;
  permission = Command.Permissions.EVERYONE;

  async execute(msg: Command.Input, variable: 'prefix' | 'level', ...args: string[]): Promise<Command.Output> {
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
    const permissionLevel = PermissionMultiplexer.getUserPermissions(msg.user, msg.channel);

    switch (variable) {
      case 'prefix': {
        if (permissionLevel < Command.Permissions.TRUSTED) {
          return;
        }

        const { channel } = msg;
        channel.prefix = args.join(' ');

        await manager.save(channel);

        return { reply: `Prefix for this channel has been successfully set to ${channel.prefix}` };
      }

      case 'level': {
        if (permissionLevel < Command.Permissions.ADMIN) {
          return;
        }

        const [username, level] = args.map((i) => i.toLowerCase());
        const user = await UserManager.get(username);

        if (!user) {
          return {
            reply: 'No user found with that username.',
            success: false,
          };
        }

        const levels = {
          admin: Levels.ADMIN,
          trusted: Levels.TRUSTED,
          user: Levels.USER,
        };

        if (!(level in levels)) {
          return {
            reply: 'Could not find that level',
            success: false,
          };
        }

        user.level = levels[level];
        await manager.save(user);

        return { reply: `Successfully updated ${user.name}'s level to ${level}.` };
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
