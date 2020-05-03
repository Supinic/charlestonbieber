/* eslint-disable @typescript-eslint/no-empty-function */
// TriCatch

import WebSocket from 'ws';
import { JsonObject } from 'type-fest';
import { randomBytes } from 'crypto';
import { getManager } from 'typeorm';
import { Platform, ChannelManager } from '../modules';

interface PubSubMessage<T = JsonObject> {
  type: string;
  data: T;
}

// FeelsGoodMan
interface Message {
  topic: string;
  message: string;
}

// FeelsAmazingMan
interface MessageMessage {
  type: 'viewcount' | 'commercial' | 'stream-up' | 'stream-down' | 'reward-redeemed';
  viewers?: number;
}

export class PubSub extends Platform {
  // @ts-ignore
  name = 'PubSub';
  client: WebSocket;

  manager = getManager();
  ping: NodeJS.Timeout;

  private connect(): void {
    this.client = new WebSocket('wss://pubsub-edge.twitch.tv');

    this.client.on('open', async () => {
      console.info('Connected to PubSub. Subscribing to topics.');

      const channels = await ChannelManager.getJoinable(Platform.get(Platform.Names.TWITCH));

      for (const { name, platformID } of channels) {
        this.sendData('LISTEN', {
          topics: [
            this.createTopic('video-playback', name),
            this.createTopic('community-points-channel-v1', platformID),
          ],
          // eslint-disable-next-line @typescript-eslint/camelcase
          auth_token: process.env.TWITCH_PASSWORD,
        });
      }

      this.ping = setInterval(() => this.sendData('PING'), 3e5);
    });

    this.client.on('message', async stringifiedData => {
      const { data, type }: PubSubMessage<Message> = JSON.parse(stringifiedData as string);

      switch (type) {
        case 'PONG':
          console.debug('Received PONG from PubSub');
          break;

        case 'MESSAGE':
          if (data) {
            const message: MessageMessage = JSON.parse(data.message);
            const { topic } = data;
            const channel = await ChannelManager.get(topic.replace(/^(video-playback|community-points-channel-v1)\./, ''));

            switch (message.type) {
              case 'viewcount':
                if (channel.live) {
                  channel.viewcount = message.viewers;

                  await this.manager.save(channel);
                }
                break;

              case 'stream-up':
                channel.live = true;

                await this.manager.save(channel);
                break;

              case 'stream-down':
                channel.live = false;
                channel.viewcount = 0;

                await this.manager.save(channel);
                break;

              case 'reward-redeemed':
              case 'commercial':
                console.debug(message);

                await Platform.get(Platform.Names.TWITCH).message(channel, 'asd');
                break;
            }
          }
          break;

        case 'RECONNECT':
          console.warn('PubSub server sent a reconnect message. Restarting the socket.');
          this.client.close();
          break;
      }
    });

    this.client.on('close', () => {
      clearInterval(this.ping);

      this.client = null;
      this.connect();
    });
  }

  constructor() {
    super();

    this.connect();
  }

  private createTopic(topic: string, channel: string): string {
    return [topic, channel].join('.');
  }

  sendData(type: string, data?: JsonObject): void {
    this.client.send(JSON.stringify({
      type,
      data,
      nonce: randomBytes(16).toString('hex'),
    }));
  }

  async message(): Promise<void> {}
  async pm(): Promise<void> {}
}
