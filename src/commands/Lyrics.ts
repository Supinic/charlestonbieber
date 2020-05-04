import got from 'got';
import { Command } from '../modules';

export class Lyrics extends Command {
  name = 'lyrics';
  aliases = ['shazam'];
  description = 'Guesses a song by its lyrics';
  syntax = ['lyrics'];
  cooldown = 10000;
  data = null;
  permission = Command.Permissions.EVERYONE;

  async execute(_msg: Command.Input, ...args: string[]): Promise<Command.Output> {
    if (args.length === 0) {
      return {
        reply: 'Lyrics must be provided',
        cooldown: 2500,
        success: false,
      };
    }

    const lyrics = args.join(' ');

    const data: Lyrics.APIResponse = await got({
      url: 'https://some-random-api.ml/lyrics',
      searchParams: { title: lyrics },
    }).json();

    if (data.error) {
      return {
        reply: 'eShrug',
        cooldown: 5000,
        success: false,
      };
    }

    return { reply: `I guess that song is ${data.title} by ${data.author}` };
  }
}

namespace Lyrics {
  export interface APIResponse {
    title: string;
    author: string;
    lyrics: string;
    thumbnail: {
      genius?: string;
    };
    links: {
      genius: string;
    };
    error: string;
  }
}
