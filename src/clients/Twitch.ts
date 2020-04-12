import { ChatClient, PrivmsgMessage } from 'dank-twitch-irc';
import { User, Channel, Platform } from '../modules';
import { Channel as ChannelEntity } from '../entities';

import {
  TWITCH_USERNAME as username,
  TWITCH_PASSWORD as password,
} from '../config.json';

export class Twitch extends Platform {
  name = 'Twitch';
  client = new ChatClient({ username, password, rateLimits: 'verifiedBot' });

  async message(channel: ChannelEntity, message: string) {
    await this.client.say(channel.name, message);
  }

  async pm(channel: ChannelEntity, message: string) {
    await this.client.whisper(channel.name, message);
  }

  constructor() {
    super();

    this.client.on('ready', () => this.client.joinAll(Channel.channels.filter(i => i.platform === this.name).map(i => i.name)));

    const messageTypes = ['PRIVMSG', 'WHISPER'];

    for (const type of messageTypes) {
      console.log('xd');
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
