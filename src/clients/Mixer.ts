import WebSocket from 'ws';
import {
  Client,
  DefaultRequestRunner,
  OAuthProvider,
  ChatService,
  Socket,
  IChatJoinResponse,
  IChatMessage,
  IUserSelf,
} from '@mixer/client-node';
import { Platform, ChannelManager } from '../modules';
import { Channel } from '../entities';

export class Mixer extends Platform {
  name = Platform.Names.MIXER;
  client = new Client(new DefaultRequestRunner());

  chatService = new ChatService(this.client);
  channels = new Map<Channel, Socket>();

  constructor() {
    super();

    // @ts-ignore
    this.client.use(new OAuthProvider(this.client, {
      tokens: {
        access: process.env.MIXER_OAUTH,
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
      },
    }));

    this.getUserInfo().then(async (userInfo) => {
      console.info('Connected to Mixer. Joining channels.');

      const channels = await ChannelManager.getJoinable(this);

      for (const channel of channels) {
        this.channels.set(channel, await this.join(userInfo.id, channel));
      }
    });
  }

  async getUserInfo(): Promise<IUserSelf> {
    const { body } = await this.client.request<IUserSelf>('GET', 'users/current');

    return body;
  }

  async getConnectionInfo({ platformID }: Channel): Promise<IChatJoinResponse> {
    const { body } = await this.chatService.join(Number(platformID));

    return body;
  }

  async join(userID: number, channel: Channel): Promise<Socket> {
    const { endpoints, authkey } = await this.getConnectionInfo(channel);
    // @ts-ignore
    const socket = new Socket(WebSocket, endpoints).boot();

    socket.on('ChatMessage', (data: IChatMessage) => super.handleMessage({
      type: 'message',
      rawMessage: data.message.message[0].text,
      user: {
        platformID: String(data.user_id),
        name: data.user_name,
      },
      channel,
    }));

    socket.on('error', (error: Error) => console.error(`${Mixer.name}:`, error));

    socket.on('reconnecting', () => console.info('Reconnecting to Mixer socket:', channel));

    await socket.auth(Number(channel.platformID), userID, authkey);

    return socket;
  }

  async message(channel: Channel, message: string): Promise<void> {
    await this.channels.get(channel).call('msg', [message]);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async pm(): Promise<void> { }
}
