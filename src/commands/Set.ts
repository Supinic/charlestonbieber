import { getManager } from 'typeorm';
import { Command,  } from '../modules';
import { bingMaps } from '../modules/GotInstances';
import { LocationData } from './types';

export class Set extends Command {
  name = 'set';
  aliases = [];
  syntax = ['variable', 'value'];
  description = 'Allows users to customize their variables within the bot';
  cooldown = 10000;
  data = null;
  permission = Command.Permissions.EVERYONE;

  async execute(msg: Command.Input, variable: 'location', ...args: string[]): Promise<Command.Output> {
    if (!variable) {
      return {
        reply: 'A variable must be provided',
        cooldown: 2500,
        success: false,
      };
    }

    const value = args.join(' ');

    if (!value) {
      return {
        reply: 'A value must be provided',
        cooldown: 2500,
        success: false,
      };
    }

    switch (variable) {
      case 'location':
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

        msg.user.location = location.point.coordinates;
        await getManager().save(msg.user);

        return { reply: 'Location has been successfully set' };
    }
  }
}
