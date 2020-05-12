import got from 'got';
import { JsonValue } from 'type-fest';

const json = got.extend({ responseType: 'json' });

export const someRandomAPI = json.extend({ prefixUrl: 'https://some-random-api.ml' });

export const supi = json.extend({
  prefixUrl: 'https://supinic.com/api',
  headers: {
    Authorization: `Basic ${[process.env.SUPIBOT_ID, process.env.SUPI_API_KEY].join(':')}`,
    'User-Agent': process.env.TWITCH_USERNAME,
  },
});

export const misia = got.extend({
  prefixUrl: 'https://kotmisia.pl/api',
  headers: { 'User-Agent': process.env.TWITCH_USERNAME },
});

export namespace Supi {
  export interface Response<T = JsonValue> {
    statusCode: number;
    timestamp: number;
    data?: T;
    error?: {
      message: string;
      data?: JsonValue;
    };
  }

  export namespace SongRequest {
    export interface Queue {
      ID: number;
      vlcID: number;
      link: string;
      videoType: 1;
      name: string;
      length: number;
      status: Status;
      userAlias: number;
      added: string;
      started?: string;
      ended?: string;
      parsedLink: string;
    }

    export enum Status {
      CURRENT = 'Current',
      QUEUED = 'Queued',
    }
  }
}
