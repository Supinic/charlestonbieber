import { Twitch } from '../clients';
import {
  Command,
  timeDelta,
  Platform,
  createResponseFromObject,
} from '../modules';

export class Ping extends Command {
  name = 'ping';
  aliases = null;
  description = 'See if the bot is alive';
  syntax = null;
  cooldown = 5000;
  data = null;
  permission = Command.Permissions.EVERYONE;

  async execute({ platform }: Command.Input): Promise<Command.Output> {
    let latency: string;

    if (platform === Platform.get(Platform.Names.TWITCH)) {
      const start = process.hrtime.bigint();
      await (platform as Twitch).client.ping();
      const end = process.hrtime.bigint();

      latency = `${Math.round(Number(end - start) / 1e6)}ms`;
    } else {
      latency = 'Could not calculate';
    }

    const data = {
      Uptime: timeDelta(new Date(Date.now() - process.uptime() * 1000), true),
      Latency: latency,
    };

    return { reply: `FeelsDankMan 🏓 pong! ${createResponseFromObject(data)}` };
  }
}
