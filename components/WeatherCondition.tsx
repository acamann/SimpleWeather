import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import StyledText from "./StyledText";
import { Weather } from '../api/models';
import WeatherIcon from './WeatherIcon';

interface WeatherConditionProps {
  weather: Weather[];
}

const WeatherCondition: React.FC<WeatherConditionProps> = (props: WeatherConditionProps) => {
  const weather = props.weather;

  return weather.length > 0 ? (
    <View style={styles.condition}>
      <StyledText>
        {weather[0].main}
      </StyledText>
      <WeatherIcon
        conditionId={weather[0].id}
        style={styles.icon}
      />
    </View>
  ) : null;
}

export default WeatherCondition;

const styles = StyleSheet.create({
  condition: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  icon: {
    width: 24,
    height: 24
  }
});
