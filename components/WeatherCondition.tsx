import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Weather } from '../api/models';

interface WeatherConditionProps {
  weather: Weather[];
}

const WeatherCondition: React.FC<WeatherConditionProps> = (props: WeatherConditionProps) => {
  const weather = props.weather;

  return weather.length > 0 ? (
    <View style={styles.condition}>
      <Text>
        {weather[0].main}
      </Text>
      <Image
        style={styles.icon}
        source={{ uri: `http://openweathermap.org/img/wn/${weather[0].icon}.png` }}
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
