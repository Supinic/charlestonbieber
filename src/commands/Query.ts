import got from 'got';
import { Command, Input, Output, Permissions } from '../modules';
import { WOLFRAM_APPID as appid } from '../config.json';

export class Query extends Command {
  name = 'query';
  aliases = ['wolfram'];
  description = 'Solve a complex (or simple) problem, using Wolfram|Alpha';
  syntax = ['problem'];
  cooldown = 15000;
  data = null;
  permission = Permissions.EVERYONE;

  async execute(_msg: Input, ...args: string[]): Promise<Output> {
    const problem = args.join(' ');

    if (!problem) {
      return {
        reply: 'A problem must be provided',
        success: false,
        cooldown: 5000,
      };
    }

    const answer = await got({
      url: 'https://api.wolframalpha.com/v1/result',
      searchParams: {
        i: problem,
        appid,
      },
    }).text();

    return { reply: answer };
  }
}
