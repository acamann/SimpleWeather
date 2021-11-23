import { REACT_APP_MAPBOX_ACCESS_TOKEN } from 'react-native-dotenv';
import { getTileFromCoordinates } from '../utils/map';
import { MapData } from './models';

const accessToken = REACT_APP_MAPBOX_ACCESS_TOKEN;

export const getHomeMapSrc = (mapData: MapData): string | undefined => {
  const { latitude, longitude, zoom } = mapData;
  const { x, y } = getTileFromCoordinates(longitude, latitude, zoom);
  return accessToken ? `https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/${zoom}/${x}/${y}?access_token=${accessToken}` : undefined;
}

// static image
// https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-95.5405,29.8094,9,0/300x300@2x?access_token=YOUR_MAPBOX_ACCESS_TOKEN
// `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s-home(${lon},${lat})/${lon},${lat},${zoom},0/300x300@2x?access_token=${accessToken}`

// static tile
// https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/1/1/0?access_token=blah