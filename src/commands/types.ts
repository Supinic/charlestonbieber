export type WeatherData = {
  coord: {
    /** City geo location, longitude */
    lon: number;
    /** City geo location, latitude */
    lat: number;
  };
  weather: {
    /** Weather condition id */
    id: number;
    /** Group of weather parameters (Rain, Snow, Extreme etc.) */
    main: string;
    /** Weather condition within the group */
    description: string;
    /** Weather icon id */
    icon: '01d' | '01n' | '02d' | '02n' | '03d' | '03n' | '04d' | '04n' | '09d' | '09n' | '10d' | '10n' | '11d' | '11n' | '13d' | '13n' | '50d' | '50n';
  }[];
  /** Internal parameter */
  base: string;
  main: {
    /** Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit. */
    temp: number;
    /** Temperature. This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit. */
    feels_like: number;
    /** Atmospheric pressure (on the sea level, if there is no sea_level or grnd_level data), hPa */
    pressure: number;
    /** Humidity, % */
    humidity: number;
    /** Minimum temperature at the moment. This is deviation from current temp that is possible for large cities and megalopolises geographically expanded (use these parameter optionally). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit. */
    temp_min: number;
    /** Maximum temperature at the moment. This is deviation from current temp that is possible for large cities and megalopolises geographically expanded (use these parameter optionally). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit. */
    temp_max: number;
    /** Atmospheric pressure on the sea level, hPa */
    sea_level: number;
    /** Atmospheric pressure on the ground level, hPa */
    grnd_level: number;
  };
  wind: {
    /** Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour. */
    speed: number;
    /** Wind direction, degrees (meteorological) */
    deg: number;
  };
  clouds: {
    /** Cloudiness, % */
    all: number;
  };
  /** Time of data calculation, unix, UTC */
  dt: number;
  sys: {
    /** Internal parameter */
    type: number;
    /** Internal parameter */
    id: number;
    /** Internal parameter */
    message: number;
    /** Country code (GB, JP etc.) */
    country: string;
    /** Sunrise time, unix, UTC */
    sunrise: number;
    /** Sunset time, unix, UTC */
    sunset: number;
  };
  /** Shift in seconds from UTC */
  timezone: number;
  /** City ID */
  id: number;
  /** City name */
  name: string;
  /** Internal parameter */
  cod: string;
};

export type LocationData = {
  authenticationResultCode: string;
  brandLogoUri: 'http://dev.virtualearth.net/Branding/logo_powered_by.png';
  copyright: 'Copyright © 2020 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.';
  resourceSets: {
    estimatedTotal: string;
    resources: {
      __type: 'Location:http://schemas.microsoft.com/search/local/ws/rest/v1';
      bbox: [number, number, number, number];
      name: string;
      point: {
        type: 'Point';
        coordinates: [number, number];
      };
      address: {
        adminDistrict: string;
        countryRegion: string;
        formattedAddress: string;
        locality: string;
      };
      confidence: string;
      entityType: string;
      geocodePoints: {
        type: 'Point';
        coordinates: [number, number];
        calculationMethod: string;
        usageTypes: string[];
      }[];
      matchCodes: string[];
    }[];
  }[];
}

export namespace Misia {
  export namespace Suggestion {
    export enum States {
      ACCEPTED = 'accepted',
      DONE = 'done',
      NEW = 'new',
      NOT_A_SUGGESTION = 'not_a_suggestion',
      REJECTED = 'rejected',
    }

    export interface Stats {
      count: number;
      count_hidden: number;
      states: {
        accepted: number;
        done: number;
        new: number;
        not_a_suggestion: string;
        rejected: string;
      };
      top_users: {
        count: number;
        id: number;
        name: string;
      }[];
    }
  }
}
