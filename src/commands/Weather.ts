import got from 'got';
import { Command, Input, Output, User, Permissions, getOption } from '../modules';
import { OWM_KEY as appid } from '../config.json';
import { WeatherData } from './types';

export class Weather extends Command {
  name = 'weather';
  aliases = [];
  syntax = ['location?', 'lat=?', 'lon=?', 'units=?'];
  description = 'Returns the current weather forecast for specified location or user\'s default location';
  cooldown = 10000;
  data = {
    symbols: {
      '01d': '🌞',
      '01n': '🌚',
      '02d': '⛅',
      '02n': '⛅',
      '03d': '☁',
      '03n': '☁',
      '04d': '🌥',
      '04n': '🌥',
      '09d': '🌧',
      '09n': '🌧',
      '10d': '🌦',
      '10n': '🌦',
      '11d': '🌩',
      '11n': '🌩',
      '13d': '❄',
      '13n': '❄',
      '50d': '🌫',
      '50n': '🌁',
    },
  };
  permission = Permissions.EVERYONE;

  async execute(msg: Input, ...args: string[]): Promise<Output> {
    const searchParams = {
      units: getOption('units', args, true) || 'metric',
      appid,
    };

    if (!['imperial', 'metric', 'default'].includes(searchParams.units)) {
      return {
        reply: '"units" must be "imperial", "metric" (default), or "default" (Kelvin)',
        cooldown: 2500,
        success: false,
      };
    }

    {
      const lat = getOption('lat', args, true);
      const lon = getOption('lon', args, true);

      if (lat && !lon) {
        return {
          reply: 'A longtitude must be provided',
          cooldown: 2500,
          success: false,
        };
      }

      if (lon && !lat) {
        return {
          reply: 'A latitude must be provided',
          cooldown: 2500,
          success: false,
        };
      }

      if (lat && lon) {
        searchParams['lat'] = lat;
        searchParams['lon'] = lon;
      }
    }

    for (let i = 0; i < args.length; i++) {
      const token = args[i];

      if (token.startsWith('@')) {
        const user = await User.get(token.slice(1));

        if (user?.location) {
          const [lat, lon] = user.location;

          searchParams['lat'] = lat;
          searchParams['lon'] = lon;

          args.splice(i, 1);
        }
      }
    }

    if (args.length) {
      searchParams['q'] = args.join(' ');
    } else if (!('lat' in searchParams && 'lon' in searchParams) && msg.user.location) {
      const [lat, lon] = msg.user.location;

      searchParams['lat'] = lat
      searchParams['lon'] = lon;
    } else if (!('lat' in searchParams && 'lon' in searchParams)) {
      return {
        reply: 'A location must be provided',
        cooldown: 2500,
        success: false,
      };
    }

    const data: WeatherData = await got({
      url: 'https://api.openweathermap.org/data/2.5/weather',
      throwHttpErrors: false,
      searchParams,
    }).json();

    if (data.cod === '404') {
      return { reply: 'eShrug', success: false };
    }

    const symbol = this.data.symbols[data.weather[0].icon];
    const deg = `${searchParams.units === 'metric' ? '°C' : searchParams.units === 'imperial' ? '°F' : 'K'}`;

    const res = {
      Temperature: data.main.temp + deg,
      'Feels like': data.main.feels_like + deg,
      Clouds: `${data.clouds.all}%`,
      Wind: `${data.wind.speed} ${searchParams.units === 'imperial' ? 'mph' : 'km/h'}`,
      Humidity: `${data.main.humidity}%`,
    };

    return {
      reply: `
        ${data.name}, ${data.sys.country || '🌐'} ${symbol}
        ${Object.entries(res).map((i) => i.join(': ')).join(' | ')}
      `,
     };
  }
}
