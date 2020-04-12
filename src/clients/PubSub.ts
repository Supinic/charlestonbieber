import WebSocket from 'ws';
import { JsonObject } from 'type-fest';
import { randomBytes } from 'crypto';
import { Platform, Channel } from '../modules';
import { TWITCH_PASSWORD as auth_token } from '../config.json';
import { getConnection } from 'typeorm';

const connection = getConnection();

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
  name = 'PubSub';
  client = new WebSocket('wss://pubsub-edge.twitch.tv');

  constructor() {
    super();

    this.client.on('open', () => {
      console.info('Connected to PubSub. Subscribing to topics.');

      const channels = Channel.channels.filter(i => i.platform === 'Twitch');

      for (const { name, platformID } of channels) {
        this.send('LISTEN', {
          topics: [
            this.createTopic('video-playback', name),
            this.createTopic('community-points-channel-v1', platformID),
          ],
          auth_token, 
        });
      }

      setInterval(() => this.send('PING'), 3e4);
    });

    this.client.on('message', async (stringifiedData: string) => {
      const { data, type }: PubSubMessage<MESSAGE> = JSON.parse(stringifiedData);

      switch (type) {
        case 'PONG':
          console.debug('Received PONG from PubSub');
          break;

        case 'MESSAGE':
          if (data) {
            const message: MESSAGE_MESSAGE = JSON.parse(data.message);
            const { topic } = data;
            const channel = Channel.get(topic.replace(/^(video-playback|community-points-channel-v1)\./, ''));

            switch (message.type) {
              case 'viewcount':
                const { viewers } = message;

                channel.viewers = viewers;
                connection.manager.save(channel);

                await Channel.reload(connection);
                break;
              
              case 'stream-up':
                channel.live = true;

                connection.manager.save(channel);
                await Channel.reload(connection);
                break;

              case 'stream-down':
                channel.live = false;
                
                connection.manager.save(channel);
                await Channel.reload(connection);
                break;

              case 'reward-redeemed':
              case 'commercial':
                console.debug(message);

                await Platform.get('Twitch').message(channel, 'asd');
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
  }

  private createTopic(topic: string, channel: string): string {
    return [topic, channel].join('.');
  }

  send(type: string, data?: JsonObject): void {
    this.client.send(JSON.stringify({
      type,
      nonce: randomBytes(15).toString('hex'),
      data
    }));
  }

  async message() {}
  async pm() {}
}
