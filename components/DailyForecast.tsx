import React from 'react';
import { View, StyleSheet } from 'react-native';
import StyledText from "./StyledText";
import { DailyWeather } from '../api/models';
import { formatDateFromUnix, formatTemp } from '../utils/common';
import WeatherCondition from './WeatherCondition';

interface DailyForecastProps {
  daily: DailyWeather[];
}

const DailyForecast: React.FC<DailyForecastProps> = (props: DailyForecastProps) => {
  const daily = props.daily;

  return (
    <View style={styles.wrapper}>
      <StyledText style={{ fontWeight: '700' }}>
        Daily Forecast
      </StyledText>
      {daily.map(day => (
        <View style={styles.forecast} key={day.dt.toString()}>
          <StyledText style={styles.forecastDateTime}>
            {formatDateFromUnix(day.dt)}
          </StyledText>
          <StyledText>
            &#8593; {formatTemp(day.temp.max)}
          </StyledText>
          <StyledText>
            &#8595; {formatTemp(day.temp.min)}
          </StyledText>
          <WeatherCondition weather={day.weather} />
        </View>
      ))}
    </View>
  );
}

export default DailyForecast;

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
    gap: 16,
  },
  forecastDateTime: {
    flex: 1
  }
});