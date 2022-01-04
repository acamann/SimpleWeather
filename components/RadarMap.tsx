import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { getHomeMapSrc } from '../api/MapBox';
import { MapData } from '../api/models';
import { getCurrentWeatherMapSrc, WeatherLayer } from '../api/OpenWeatherMap';
import { Dimensions } from 'react-native';

const RadarMap: React.FC<MapData> = ({ latitude, longitude, zoom }) => {
  return (
    <View style={styles.wrapper}>
      <Image
        source={{ uri: getHomeMapSrc({ latitude, longitude, zoom }) }}
        style={styles.layer}
      />
      <Image
        source={{ uri: getCurrentWeatherMapSrc(WeatherLayer.Precipitation, { latitude, longitude, zoom }) }}
        style={styles.layer}
      />
      <Image
        source={{ uri: getCurrentWeatherMapSrc(WeatherLayer.Clouds, { latitude, longitude, zoom }) }}
        style={styles.layer}
      />
    </View>
  );
}

export default RadarMap;

const styles = StyleSheet.create({
  wrapper: {
    width: 0.9 * Dimensions.get('window').width,
    height: 0.9 * Dimensions.get('window').width,
    //borderColor: colors.lighter,
    borderWidth: 1,
    position: 'relative',
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});