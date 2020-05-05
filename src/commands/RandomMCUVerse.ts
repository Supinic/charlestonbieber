import { getManager } from 'typeorm';
import { Command, randomItem } from '../modules';
import { MCUVerse } from '../entities';

export class RandomMCUVerse extends Command {
  name = 'randommcuverse';
  aliases = ['rmcuv', 'randommarvelcinematicuniverseverse'];
  description = 'Returns a random quote from MCU as a Bible verse';
  syntax = null;
  cooldown = 5000;
  data = { verses: null };
  permission = Command.Permissions.EVERYONE;

  async execute(): Promise<Command.Output> {
    if (!this.data.verses) {
      this.data.verses = await getManager().find(MCUVerse);
    }

    const { sub, time, movieTitle } = randomItem(this.data.verses);
    const reply = `${sub} (${movieTitle} ${time})`;

    return { reply };
  }
}
