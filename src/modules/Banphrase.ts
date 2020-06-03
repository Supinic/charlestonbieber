/* eslint-disable @typescript-eslint/naming-convention */
import got from 'got';
import escapeStringRegexp from 'escape-string-regexp';
import { getRepository } from 'typeorm';
import { Channel, Banphrase } from '../entities';
import type { Platform } from '.';

export enum BanphraseTypes {
  PAJBOT = 'Pajbot',
}

export class Pajbot {
  static async checkBanphrase(
    { banphraseURL }: Channel,
    message: string,
  ): Promise<Pajbot.Banphrase> {
    const data: Pajbot.Banphrase = await got({
      method: 'POST',
      url: `https://${banphraseURL}/api/v1/banphrases/test`,
      form: { message },
    }).json();

    return data;
  }

  static async clean(message: string, channel: Channel): Promise<string> {
    if (channel.banphraseType !== BanphraseTypes.PAJBOT) {
      throw new Error(`Expected channel.banphraseType to be "Pajbot", got ${channel.banphraseType}`);
    }

    const { banned, banphrase_data } = await this.checkBanphrase(channel, message);
    let msg = message;

    if (banned) {
      let pattern: string;
      let flags = 'g';

      if (!banphrase_data.case_sensitive) {
        flags += 'i';
      }

      switch (banphrase_data.operator) {
        case 'regex':
          pattern = banphrase_data.phrase;
          break;
        case 'contains':
          pattern = escapeStringRegexp(banphrase_data.phrase);
          break;
      }

      msg = msg.replace(new RegExp(pattern, flags), '[BANNED]');
    }

    return msg;
  }
}

namespace Pajbot {
  export interface Banphrase {
    banned: boolean;
    input_message: string;
    banphrase_data?: {
      id: number;
      name: string;
      phrase: string;
      length: number;
      permanent: boolean;
      operator: 'regex' | 'contains';
      case_sensitive: boolean;
    };
  }
}

export async function cleanBanphrases(
  message: string,
  channel: Channel,
  platform: Platform,
  external = false,
): Promise<string> {
  const banphrases = (await getRepository(Banphrase).find({ relations: ['channel'] }))
    .filter((i) => (
      (i.channel === null || i.channel.id === channel.id)
        && (i.platform === null || i.platform === platform.name)
    ));
  let msg = message;

  for (const {
    type,
    caseSensitive,
    banphrase,
    replaceWith,
  } of banphrases) {
    let pattern: string;
    let flags = 'g';

    if (!caseSensitive) {
      flags += 'i';
    }

    switch (type) {
      case Banphrase.Types.REGEX:
        pattern = banphrase;
        break;
      case Banphrase.Types.CONTAINS:
        pattern = escapeStringRegexp(banphrase);
        break;
    }

    msg = msg.replace(new RegExp(pattern, flags), `[object ${replaceWith}]`);
  }

  if (external) {
    switch (channel.banphraseType) {
      case BanphraseTypes.PAJBOT:
        msg = await Pajbot.clean(msg, channel);
        break;
    }
  }

  return msg;
}
