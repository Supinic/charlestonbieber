import { Command, Input, Output, timeDelta, Platform, PlatformNames, Permissions } from '../modules';

export class Ping extends Command {
  name = 'ping';
  aliases = [];
  description = 'See if the bot is alive';
  syntax = [];
  cooldown = 5000;
  data = null;
  permission = Permissions.EVERYONE;

  async execute({ platform }: Input): Promise<Output> {
    let latency: number;

    if (platform === Platform.get(PlatformNames.TWITCH)) {
      const start = process.hrtime.bigint();
      await platform.client.ping();
      const end = process.hrtime.bigint();

      latency = Math.round(Number(end - start) / 1e6);
    }

    const data = {
      Uptime: timeDelta(new Date(Date.now() - (process.uptime() * 1e3))).split('ago').join('').trim(),
      Latency: `${latency}ms`,
    };

    return { reply: `FeelsDankMan 🏓 pong! ${Object.entries(data).map((i) => i.join(': ')).join(' | ')}` };
  }
}
