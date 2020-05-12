import { Lyrics } from './types';
import { Command, Platform, randomItem } from '../modules';
import { Supi, supi, someRandomAPI } from '../modules/GotInstances';

export class RandomLyrics extends Command {
  name = 'randomlyrics';
  aliases = null;
  permission = Command.Permissions.EVERYONE;
  cooldown = 7500;
  syntax = ['song?'];
  description = 'Fetches the lyrics of the specified song, then returns a random line from the lyrics.';
  data = null;

  async execute({ channel, platform }: Command.Input, ...args: string[]): Promise<Command.Output> {
    let usingCurrent = false;
    let title: string;

    if (
      args.length === 0
        && channel.name === 'supinic'
        && platform.name === Platform.Names.TWITCH
    ) {
      const { data: queue }: Supi.Response<Supi.SongRequest.Queue[]> = await supi('bot/song-request/queue').json();
      const current = queue.find(({ status }) => status === Supi.SongRequest.Status.CURRENT);

      if (!current) {
        return {
          reply: 'No song is playing right now',
          success: false,
          cooldown: 5000,
        };
      }

      usingCurrent = true;
      title = current.name;
    } else if (args.length === 0) {
      return {
        reply: 'A song must be specified',
        success: false,
        cooldown: 2500,
      };
    }

    if (!title) {
      title = args.join(' ');
    }

    const data: Lyrics = await someRandomAPI({
      url: 'lyrics',
      searchParams: { title },
    }).json();

    if (data.error) {
      return {
        reply: 'Could not find that song',
        success: false,
        cooldown: usingCurrent ? 5000 : 2500,
      };
    }

    const lyrics = randomItem([...new Set(
      data.lyrics
        .split('\n')
        .filter((line) => !(line.startsWith('[') && line.endsWith(']'))),
    )]);

    return {
      reply: `${lyrics} (${data.title} by ${data.author})`,
      cooldown: usingCurrent ? 10000 : this.cooldown,
    };
  }
}
