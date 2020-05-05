import { getManager } from 'typeorm';
import { Command } from '../modules';
import { bingMaps } from '../modules/GotInstances';
import { LocationData } from './types';

export class Set extends Command {
  name = 'set';
  aliases = null;
  syntax = ['variable', 'value'];
  description = 'Allows users to customize their variables within the bot';
  cooldown = 10000;
  data = null;
  permission = Command.Permissions.EVERYONE;

  async execute(msg: Command.Input, variable: 'location' | 'prefix', ...args: string[]): Promise<Command.Output> {
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

    const value = args.join(' ');
    const manager = getManager();

    switch (variable) {
      case 'location': {
        const data: LocationData = await bingMaps({
          url: `Locations/${encodeURIComponent(value)}`,
          searchParams: { maxResults: 1 },
        }).json();

        const location = data?.resourceSets?.[0]?.resources?.[0];

        if (!location) {
          return {
            reply: 'Could not find that location',
            cooldown: 5000,
            success: false,
          };
        }

        const { user } = msg;
        user.location = location.point.coordinates;

        await manager.save(user);

        return { reply: 'Location has been successfully set' };
      }

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
