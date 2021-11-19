import { OneCallWeatherResponse } from './models';
import { OPEN_WEATHER_MAP_API_KEY } from 'react-native-dotenv';

const apiKey = OPEN_WEATHER_MAP_API_KEY;
const homeCoordinates = [29.809449, -95.540523];

interface GetCurrentWeatherPayload {
  onSuccess: (weather: OneCallWeatherResponse) => void;
  onFailure: (error: any) => void;
}

export const getCurrentWeather = (payload: GetCurrentWeatherPayload): Promise<void> => {
  const exclude = 'alerts';
  const [lat, lon] = homeCoordinates;
  if (!apiKey) {
    payload.onFailure("API Key not set");
    return Promise.reject();
  }
  return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${apiKey}&units=imperial`)
    .then((response) => response.json())
    .then((json) => {
      payload.onSuccess(json);
    })
    .catch((error) => {
      payload.onFailure(error);
    });
};

export const getCurrentWeatherMapSrc = (): string | undefined => {
  const layer = "precipitation_new";  
  const zoom = 16;
  const [lat, lon] = homeCoordinates;

	const latRadians = lat * 0.017453;
  const n = 2 ^ zoom;
  const xTile = Math.round(n * ((lon + 180) / 360))
  const yTile = Math.round(n * (1 - (Math.log(Math.tan(latRadians) + (1 / Math.cos(latRadians))) / Math.PI)) / 2)
  return apiKey ? `https://tile.openweathermap.org/map/${layer}/${zoom}/${xTile}/${yTile}.png?appid=${apiKey}` : undefined;
}