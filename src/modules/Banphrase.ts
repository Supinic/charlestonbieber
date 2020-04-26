import got from 'got';
import { Channel } from '../entities';

export enum BanphraseTypes {
  PAJBOT = 'Pajbot',
}

export class Pajbot {
  static async checkBanphrase({ banphraseURL }: Channel, message: string): Promise<{
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
    }
  }> {
    return await got({
      method: 'POST',
      url: `https://${banphraseURL}/api/v1/banphrases/test`,
      form: { message },
    }).json();
  }
}
