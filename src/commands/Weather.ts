import { Command, Input, Output, User } from '../modules';
import got from 'got';
import { OWM_KEY as appid } from '../config.json';
import { WeatherData } from './types';

export class Weather extends Command {
  name = 'weather';
  aliases = [];
  cooldown = 10000;
  data = { symbols: {
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
    '50n': '🌁'
  } };

  async execute(msg: Input, ...args: string[]): Promise<Output> {
    let searchParams = {
      units: 'metric',
      appid
    };

    for (let i = args.length - 1; i >= 0; i--) {
      const token = args[i];
  
      if (/^(units|lat|lon)=/.test(token)) {
        const [option, value] = token.split('=');
        searchParams[option] = value.toLowerCase();
  
        args.splice(i, 1);
      }

      if (token.startsWith('@')) {
        const user = await User.get(token.slice(1));

        if (user?.location) {
          searchParams['lat'] = user.location[0];
          searchParams['lon'] = user.location[1];

          args.splice(i, 1);
        }
      }
    }

    if ('lat' in searchParams && !('lon' in searchParams)) {
      return {
        reply: 'A longtitude must be provided',
        cooldown: 2500,
        success: false,
      };
    }

    if ('lon' in searchParams && !('lat' in searchParams)) {
      return {
        reply: 'A latitude must be provided',
        cooldown: 2500,
        success: false,
      };
    }
    
    if (!('lat' in searchParams && 'lon' in searchParams) && msg.user.location) {
        searchParams['lat'] = msg.user.location[0];
        searchParams['lon'] = msg.user.location[1];
    } else {
      const location = args.join(' ');

      if (!location) {
        return {
          reply: 'A location must be provided',
          cooldown: 2500,
          success: false,
        };
      }

      searchParams['q'] = location;
    }

    if (!['imperial', 'metric', 'default'].includes(searchParams.units)) {
      return {
        reply: '"units" must be "imperial", "metric" (default), or "default" (Kelvin)',
        cooldown: 2500,
        success: false,
      };
    }

    const data: WeatherData = await got({
      url: 'https://api.openweathermap.org/data/2.5/weather',
      searchParams,
    }).json();

    if (data.cod === 404) {
      return { reply: 'eShrug', success: false };
    }

    const symbol = this.data.symbols[data.weather[0].icon];
    const deg = `${searchParams.units === 'metric' ? '°C' : searchParams.units === 'imperial' ? '°F' : 'K'}`;

    const res = {
      Temperature: data.main.temp + deg,
      'Feels like': data.main.feels_like + deg,
      Clouds: data.clouds.all + '%',
      Wind: `${data.wind.speed} ${searchParams.units === 'imperial' ? 'mph' : 'km/h'}`,
      Humidity: data.main.humidity + '%',
    };
  
    return { reply: `${data.name}, ${data.sys.country} ${symbol} ${Object.entries(res).map(i => i.join(': ')).join(' | ')}` };
  }
}
