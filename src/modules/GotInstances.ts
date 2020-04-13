import got from 'got';

import { SUPIBOT_ID, SUPI_API_KEY } from '../config.json';

export const supi = got.extend({
  prefixUrl: 'https://supinic.com/api',
  headers: { Authorization: `Basic ${[SUPIBOT_ID, SUPI_API_KEY].join(':')}` },
});
