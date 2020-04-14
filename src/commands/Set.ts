import { Command, Input, Output } from '../modules';
import { bingMaps } from '../modules/GotInstances';
import { getConnection } from 'typeorm';
import { LocationData } from './types';

const connection = getConnection();

export class Set extends Command {
  name = 'set';
  aliases = [];
  cooldown = 10000;
  data = null;

  async execute(msg: Input, variable: 'location', ...args: string[]): Promise<Output> {
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
        await connection.manager.save(msg.user);

        return { reply: 'Location has been successfully set' };
    }
  }
}
