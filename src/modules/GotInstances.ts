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

export const strawpoll = got.extend({ prefixUrl: 'https://strawpoll.me/api/v2' });

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

export namespace Strawpoll {
  export interface Poll {
    /** The ID of the poll. */
    id?: number;
    /** The title is the title of the poll, as entered when the poll was created. */
    title: string;
    /** An array of strings to represent the options for the poll, ordered when poll was created. */
    options: string[];
    /**
     * An array of integers that correspond to the same indexed option which specify the current
     * votes for that option. Vote index `0` will always be the votes for option index `0`.
     */
    votes?: number[];
    /**
     * `true` if the poll can accept multiple votes from one user, `false` (or not present)
     * otherwise.
     */
    multi?: boolean;
    /** How to handle checking for duplicate votes. */
    dupcheck?: 'normal' | 'permissive' | 'disabled';
    /** `true` if the poll requires users to pass a CAPTCHA to vote, `false` (or not present)
     * otherwise.
     */
    captcha?: boolean;
  }
}
