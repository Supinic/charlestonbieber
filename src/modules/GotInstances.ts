import got from 'got';

import { SUPIBOT_ID, SUPI_API_KEY, BING_MAPS_KEY } from '../config.json';

export const supi = got.extend({
  prefixUrl: 'https://supinic.com/api',
  headers: { Authorization: `Basic ${[SUPIBOT_ID, SUPI_API_KEY].join(':')}` },
});

export const bingMaps = got.extend({
  prefixUrl: 'https://dev.virtualearth.net/REST/v1',
  searchParams: { key: BING_MAPS_KEY },
});
