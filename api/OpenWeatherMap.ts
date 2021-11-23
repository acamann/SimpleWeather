import { OneCallWeatherResponse } from './models';
import { OPEN_WEATHER_MAP_API_KEY } from 'react-native-dotenv';
import { getTileFromCoordinates, homeCoordinates } from '../utils/map';

const apiKey = OPEN_WEATHER_MAP_API_KEY;

interface GetCurrentWeatherPayload {
  onSuccess: (weather: OneCallWeatherResponse) => void;
  onFailure: (error: any) => void;
}

export const getCurrentWeather = (payload: GetCurrentWeatherPayload): Promise<void> => {
  const exclude = 'alerts';
  const { latitude, longitude } = homeCoordinates;
  if (!apiKey) {
    payload.onFailure("API Key not set");
    return Promise.reject();
  }
  return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=${exclude}&appid=${apiKey}&units=imperial`)
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
  const zoom = 10;
  const { latitude, longitude } = homeCoordinates;
  const { x, y } = getTileFromCoordinates(longitude, latitude, zoom);
  return apiKey ? `https://tile.openweathermap.org/map/${layer}/${zoom}/${x}/${y}.png?appid=${apiKey}` : undefined;
}