
export interface Weather {
  id: number,
  main: string,
  description: string,
  icon: string
}

export interface CurrentWeather {
  dt: number,
  sunrise: number,
  sunset: number,
  temp: number,
  feels_like: number,
  pressure: number,
  humidity: number,
  dew_point: number,
  uvi: number,
  clouds: number,
  visibility: number,
  wind_speed: number,
  wind_gust: number,
  wind_deg: number,
  weather: Weather[],
  rain?: {
    "1h": number
  }
}

export interface MinuteWeather {
  dt: number,
  precipitation: number
}

export interface HourlyWeather {
  dt: number,
  temp: number,
  feels_like: number,
  pressure: number,
  humidity: number,
  dew_point: number,
  uvi: number,
  clouds: number,
  visibility: number,
  wind_speed: number,
  wind_deg: number,
  wind_gust: number,
  weather: Weather[],
  pop: number,
  rain?: { "1h": number }
}

export interface DailyWeather {
  dt: number,
  sunrise: number,
  sunset: number,
  moonrise: number,
  moonset: number,
  moon_phase: number,
  temp: {
    day: number,
    min: number,
    max: number,
    night: number,
    eve: number,
    morn: number
  },
  feels_like: {
    day: number,
    night: number,
    eve: number,
    morn: number
  },
  pressure: number,
  humidity: number,
  dew_point: number,
  wind_speed: number,
  wind_gust: number,
  wind_deg: number,
  weather: Weather[],
  clouds: number,
  pop: number,
  rain?: number,
  uvi: number
}

export interface OneCallWeatherResponse {
  lat: number,
  lon: number,
  timezone: string,
  timezone_offset: number,
  current: CurrentWeather,
  minutely: MinuteWeather[],
  hourly: HourlyWeather[],
  daily: DailyWeather[],
}

export interface City {
  id: number,
  name: string,
  coord: {
    lat: number,
    lon: number
  },
  country: string,
  timezone: number,
  sunrise: number,
  sunset: number
}

export interface ForecastEntry {
  dt: number,
  main: {
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    pressure: number,
    sea_level: number,
    grnd_level: number,
    humidity: number,
    temp_kf: number
  },
  weather: Weather[],
  clouds: {
    all: number,
  },
  wind: {
    speed: number,
    deg: number,
    gust: number
  },
  visibility: number,
  pop: number,
  rain: {
    "3h": number
  },
  sys: {
    pod: string // part of day "n - night, d - day"
  },
  dt_txt: string
}

export interface FiveDayWeatherResponse {
  cnt: number,
  list: ForecastEntry[],
  city: City;
}

export interface MapData {
  longitude: number,
  latitude: number,
  zoom: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20,
}