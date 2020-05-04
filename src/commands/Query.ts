import got from 'got';
import { Command, getOption } from '../modules';

export class Query extends Command {
  name = 'query';
  aliases = ['wolfram'];
  description = 'Solve a complex (or simple) problem, using Wolfram|Alpha';
  syntax = ['problem', 'units=?'];
  cooldown = 15000;
  data = null;
  permission = Command.Permissions.EVERYONE;

  async execute(_msg: Command.Input, ...args: string[]): Promise<Command.Output> {
    const searchParams: {
      units: 'metric' | 'imperial';
      appid: string;
      i?: string;
    } = {
      units: getOption('units', args, true) as 'metric' | 'imperial' || 'metric',
      appid: process.env.WOLFRAM_APPID,
    };

    if (!['metric', 'imperial'].includes(searchParams.units)) {
      return {
        reply: '"units" must be "metric" or "imperial"',
        success: false,
        cooldown: 5000,
      };
    }

    if (args.length === 0) {
      return {
        reply: 'A problem must be provided',
        success: false,
        cooldown: 5000,
      };
    }

    searchParams.i = args.join(' ');

    const answer = await got({
      url: 'https://api.wolframalpha.com/v1/result',
      throwHttpErrors: false,
      searchParams,
    }).text();

    return { reply: answer };
  }
}
