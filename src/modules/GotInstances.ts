import got from 'got';

const json = got.extend({ responseType: 'json' });

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
