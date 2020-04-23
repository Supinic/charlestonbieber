import got from 'got';
import { Command, Input, Output, Permissions } from '../modules';
import { WOLFRAM_APPID as appid } from '../config.json';

export class Query extends Command {
  name = 'query';
  aliases = ['wolfram'];
  description = 'Solve a complex (or simple) problem, using Wolfram|Alpha';
  syntax = ['problem', 'units=?'];
  cooldown = 15000;
  data = null;
  permission = Permissions.EVERYONE;

  async execute(_msg: Input, ...args: string[]): Promise<Output> {
    let searchParams = {
      units: 'metric',
      appid,
    };

    for (let i = args.length - 1; i >= 0; i--) {
      const token = args[i];

      if (token.startsWith('units=')) {
        const [option, value] = token.split('=');
        searchParams[option] = value;

        args.splice(i, 1);
      }
    }

    if (!['metric', 'imperial'].includes(searchParams['units'])) {
      return {
        reply: '"units" must be "metric" or "imperial"',
        success: false,
        cooldown: 5000,
      };
    }

    if (!args.length) {
      return {
        reply: 'A problem must be provided',
        success: false,
        cooldown: 5000,
      };
    }

    searchParams['i'] = args.join(' ');

    const answer = await got({
      url: 'https://api.wolframalpha.com/v1/result',
      throwHttpErrors: false,
      searchParams,
    }).text();

    return { reply: answer };
  }
}
