import { Channel } from '../entities';
import got from 'got';

export enum BanphraseTypes {
  PAJBOT = 'Pajbot',
}

export async function pajbot<T = string>({ banphraseURL }: Channel, message: T): Promise<{
  banned: boolean;
  input_message: T;
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
