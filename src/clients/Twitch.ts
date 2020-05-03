import { ChatClient, AlternateMessageModifier, SlowModeRateLimiter, PrivmsgMessage, WhisperMessage } from 'dank-twitch-irc';
import { ChannelManager, Platform } from '../modules';
import { Channel, User } from '../entities';

export class Twitch extends Platform {
  name = Platform.Names.TWITCH;
  client = new ChatClient({
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_PASSWORD,
    rateLimits: 'verifiedBot',
  });

  async message(channel: Channel, message: string): Promise<void> {
    await this.client.say(channel.name, message);
  }

  async pm(user: User, message: string): Promise<void> {
    await this.client.whisper(user.name, message);
  }

  constructor() {
    super();

    this.client.use(new AlternateMessageModifier(this.client));
    this.client.use(new SlowModeRateLimiter(this.client, 20));

    this.client.on('ready', async () => {
      console.info('Connected to Twitch IRC. Joining channels.');
      this.client.joinAll((await ChannelManager.getJoinable(this)).map(i => i.name));
    });

    this.client.on('PRIVMSG', async ({ messageText, senderUserID, channelID, serverTimestamp, senderUsername }: PrivmsgMessage) => await this.handleMessage({
      type: 'message',
      rawMessage: messageText,
      user: {
        platformID: senderUserID,
        name: senderUsername,
      },
      channel: channelID,
      timestamp: serverTimestamp,
    }));

    this.client.on('WHISPER', async ({ messageText, senderUserID, senderUsername }: WhisperMessage) => await this.handleMessage({
      type: 'pm',
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
