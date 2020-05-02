import { Command, timeDelta, Platform, createResponseFromObject } from '../modules';

export class Ping extends Command {
  name = 'ping';
  aliases = [];
  description = 'See if the bot is alive';
  syntax = [];
  cooldown = 5000;
  data = null;
  permission = Command.Permissions.EVERYONE;

  async execute({ platform }: Command.Input): Promise<Command.Output> {
    let latency: number;

    if (platform === Platform.get(Platform.Names.TWITCH)) {
      const start = process.hrtime.bigint();
      await platform.client.ping();
      const end = process.hrtime.bigint();

      latency = Math.round(Number(end - start) / 1e6);
    }

    const data = {
      Uptime: timeDelta(new Date(Date.now() - process.uptime() * 1000), true),
      Latency: `${latency}ms`,
    };

    return { reply: `FeelsDankMan 🏓 pong! ${createResponseFromObject(data)}` };
  }
}
