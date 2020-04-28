// TriCatch

import WebSocket from 'ws';
import { JsonObject } from 'type-fest';
import { randomBytes } from 'crypto';
import { getManager } from 'typeorm';
import { Platform, ChannelManager, PlatformNames } from '../modules';
import { TWITCH_PASSWORD as auth_token } from '../config.json';

interface PubSubMessage<T = JsonObject> {
  type: string;
  data: T;
}

// FeelsGoodMan
interface MESSAGE {
  topic: string;
  message: string;
}

// FeelsAmazingMan
interface MESSAGE_MESSAGE {
  type: 'viewcount' | 'commercial' | 'stream-up' | 'stream-down' | 'reward-redeemed';
  viewers?: number;
}

export class PubSub extends Platform {
  // @ts-ignore
  name = 'PubSub';
  client: WebSocket;

  manager = getManager();
  ping: NodeJS.Timeout;

  connect() {
    this.client = new WebSocket('wss://pubsub-edge.twitch.tv');

    this.client.onopen = async () => {
      console.info('Connected to PubSub. Subscribing to topics.');

      const channels = await ChannelManager.getJoinable(Platform.get(PlatformNames.TWITCH));

      for (const { name, platformID } of channels) {
        this.send('LISTEN', {
          topics: [
            this.createTopic('video-playback', name),
            this.createTopic('community-points-channel-v1', platformID),
          ],
          auth_token,
        });
      }

      this.ping = setInterval(() => this.send('PING'), 3e5);
    };

    this.client.onmessage = async ({ data: stringifiedData }) => {
      const { data, type }: PubSubMessage<MESSAGE> = JSON.parse(stringifiedData as string);

      switch (type) {
        case 'PONG':
          console.debug('Received PONG from PubSub');
          break;

        case 'MESSAGE':
          if (data) {
            const message: MESSAGE_MESSAGE = JSON.parse(data.message);
            const { topic } = data;
            const channel = await ChannelManager.get(topic.replace(/^(video-playback|community-points-channel-v1)\./, ''));

            switch (message.type) {
              case 'viewcount':
                if (channel.live) {
                  channel.viewers = message.viewers;

                  await this.manager.save(channel);
                }
                break;

              case 'stream-up':
                channel.live = true;

                await this.manager.save(channel);
                break;

              case 'stream-down':
                channel.live = false;
                channel.viewers = 0;

                await this.manager.save(channel);
                break;

              case 'reward-redeemed':
              case 'commercial':
                console.debug(message);

                await Platform.get(PlatformNames.TWITCH).message(channel, 'asd');
                break;
            }
          }
          break;

        case 'RECONNECT':
          console.warn('PubSub server sent a reconnect message. Restarting the socket.');
          this.client.close();
          break;
      }
    };

    this.client.onclose = () => {
      clearInterval(this.ping);

      this.client = null;
      this.connect();
    };
  }

  constructor() {
    super();

    this.connect();
  }

  private createTopic(topic: string, channel: string): string {
    return [topic, channel].join('.');
  }

  send(type: string, data?: JsonObject): void {
    this.client.send(JSON.stringify({
      type,
      data,
      nonce: randomBytes(15).toString('hex'),
    }));
  }

  async message() {}
  async pm() {}
}
