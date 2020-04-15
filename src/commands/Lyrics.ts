import got from 'got';
import { Command, Input, Output } from '../modules';

interface APIResponse {
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

export class Lyrics extends Command {
  name = 'lyrics';
  aliases = ['shazam'];
  cooldown = 10000;
  data = null;

  async execute(msg: Input, ...args: string[]): Promise<Output> {
    const lyrics = args.join(' ');

    if (!lyrics) {
      return {
        reply: 'Lyrics must be provided',
        cooldown: 2500,
        success: false,
      };
    }

    const data: APIResponse = await got({
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
