import React from 'react';
import { View, StyleSheet, Pressable, GestureResponderEvent } from 'react-native';
import StyledText from "./StyledText";
import { HourlyWeather } from '../api/models';
import { formatPercent, formatTemp, formatTimeFromUnix } from '../utils/common';
import WeatherCondition from './WeatherCondition';

interface HourlyForecastProps {
  hourly: HourlyWeather[];
  hoursToShow: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
}

const HourlyForecast: React.FC<HourlyForecastProps> = (props: HourlyForecastProps) => {
  const hourly = props.hourly;
  const hoursToShow = props.hoursToShow;
  const onPress = props.onPress;

  return (
    <Pressable
      onPress={onPress}
      style={styles.wrapper}
    >
      <StyledText style={{ fontWeight: '700' }}>
        Hourly
      </StyledText>
      {hourly.slice(0, hoursToShow).map(hour => (
        <View style={styles.forecast} key={hour.dt.toString()}>
          <StyledText style={styles.forecastDateTime}>
            {formatTimeFromUnix(hour.dt)}
          </StyledText>
          <StyledText>
            {formatTemp(hour.temp)}
          </StyledText>
          <StyledText style={{ width: 40 }}>
            {hour.pop > 0 ? formatPercent(hour.pop) : undefined}
          </StyledText>
          <StyledText style={{ width: 30 }}>
            {hour.rain ? `${hour.rain["1h"]}` : undefined}
          </StyledText>
          <WeatherCondition weather={hour.weather} />
        </View>
      ))}
    </Pressable>
  );
}

export default HourlyForecast;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  },
  forecast: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    //gap: 16,
  },
  forecastDateTime: {
    flex: 1
  }
});