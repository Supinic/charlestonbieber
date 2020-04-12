import { Command, Input, Output } from '../modules';
import { randomArray } from '../modules/Util';
import { getConnection } from 'typeorm';
import { MCUVerse } from '../entities';

export class RandomMCUVerse extends Command {
  name = 'randommcuverse';
  aliases = ['rmcuv', 'randommarvelcinematicuniverseverse'];
  cooldown = 5000;
  data = { verses: null };

  async execute(msg: Input, ...args: string[]): Promise<Output> {
    if (!this.data.verses) {
      this.data.verses = await getConnection().manager.find(MCUVerse);
    }

    const { sub, time, movieTitle } = randomArray(this.data.verses);
    const reply = `${sub} (${movieTitle} ${time})`;

    return { reply };
  }
}
