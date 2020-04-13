import { ChatClient, AlternateMessageModifier, SlowModeRateLimiter, PrivmsgMessage, WhisperMessage } from 'dank-twitch-irc';
import { Channel, Platform, PlatformNames } from '../modules';
import { Channel as ChannelEntity, User as UserEntity } from '../entities';

import {
  TWITCH_USERNAME as username,
  TWITCH_PASSWORD as password,
} from '../config.json';

export class Twitch extends Platform {
  name = PlatformNames.TWITCH;
  client = new ChatClient({ username, password, rateLimits: 'verifiedBot' });

  async message(channel: ChannelEntity, message: string): Promise<void> {
    await this.client.say(channel.name, message);
  }

  async pm(user: UserEntity, message: string): Promise<void> {
    await this.client.whisper(user.name, message);
  }

  constructor() {
    super();

    this.client.use(new AlternateMessageModifier(this.client));
    this.client.use(new SlowModeRateLimiter(this.client, 20));

    this.client.on('ready', () => {
      console.info('Connected to Twitch IRC. Joining channels.');
      this.client.joinAll(Channel.channels.filter(i => i.platform === this.name).map(i => i.name));
    });

    this.client.on('PRIVMSG', async ({ messageText, senderUserID, channelID, serverTimestamp, senderUsername }: PrivmsgMessage) => await this.handleCommand('message', {
      rawMessage: messageText,
      user: {
        platformID: senderUserID,
        name: senderUsername,
      },
      channel: channelID,
      timestamp: serverTimestamp,
    }));

    this.client.on('WHISPER', async ({ messageText, senderUserID, senderUsername }: WhisperMessage) => await this.handleCommand('pm', {
      rawMessage: messageText,
      user: {
        platformID: senderUserID,
        name: senderUsername,
      },
      channel: null,
      timestamp: new Date(),
    }));

    this.client.connect();
  }
}
