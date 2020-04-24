import got from 'got';

import config from '../config.json';

const json = got.extend({ responseType: 'json' });

export const supi = json.extend({
  prefixUrl: 'https://supinic.com/api',
  headers: {
    Authorization: `Basic ${[config.SUPIBOT_ID, config.SUPI_API_KEY].join(':')}`,
    'User-Agent': config.TWITCH_USERNAME,
  },
});

export const bingMaps = json.extend({
  prefixUrl: 'https://dev.virtualearth.net/REST/v1',
  searchParams: { key: config.BING_MAPS_KEY },
});
