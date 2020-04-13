import { ChatClient, PrivmsgMessage } from 'dank-twitch-irc';
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

    this.client.on('ready', () => {
      console.info('Connected to Twitch IRC. Joining channels.');
      this.client.joinAll(Channel.channels.filter(i => i.platform === this.name).map(i => i.name));
    });

    const messageTypes = ['PRIVMSG', 'WHISPER'];

    for (const type of messageTypes) {
      this.client.on(type, async ({ messageText, senderUserID, channelID, serverTimestamp, senderUsername }: PrivmsgMessage) => await this.handleCommand(type === 'PRIVMSG' ? 'message' : 'pm', {
        rawMessage: messageText,
        user: {
          platformID: senderUserID,
          name: senderUsername,
        },
        channel: channelID,
        timestamp: serverTimestamp,
      }));
    }

    this.client.connect();
  }
}
