import React from 'react';
import { View, StyleSheet, GestureResponderEvent, Pressable, Image } from 'react-native';
import StyledText from "./StyledText";
import { colors } from './Colors';
import { CurrentWeather, MinuteWeather } from '../api/models';
import WeatherIcon from './WeatherIcon';
import { formatTemp } from '../utils/common';
import { getCurrentWeatherMapSrc } from '../api/OpenWeatherMap';

interface CurrentWeatherViewProps {
  current: CurrentWeather;
  minutely: MinuteWeather[];
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
  fullScreenDetails?: boolean;
}

const CurrentWeatherView: React.FC<CurrentWeatherViewProps> = (props: CurrentWeatherViewProps) => {
  const current = props.current;
  const minutely = props.minutely;
  const onPress = props.onPress;
  const fullScreenDetails = props.fullScreenDetails ?? false;

  return (
    <Pressable style={{ display: 'flex', width: '100%' }} onPress={onPress}>
      <>
        <View style={styles.currentWeather}>
          <WeatherIcon
            style={styles.icon}
            conditionId={current.weather[0]?.id}
          />
          <View style={styles.temps}>
            <StyledText style={styles.temp}>
              {formatTemp(current.temp)}
            </StyledText>
            <StyledText>
              {current.weather.length > 0 ? (
                `${current.weather[0].description}, `
              ) : undefined}
              feels like {formatTemp(current.feels_like)}
            </StyledText>
          </View>
        </View>
        { fullScreenDetails ? (
          <>
            <StyledText style={{ fontWeight: '700'}}>
              Next Hour Rainfall
            </StyledText>
            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', minHeight: 30 }}>
              {minutely.map(minute => 
                <View style={{
                  width: `${100 / 60}%`,
                  height: minute.precipitation === 0 ? 1 : minute.precipitation * 100,
                  backgroundColor: colors.accent
                }} ></View>
              )}
            </View>
            <StyledText style={{ fontWeight: '700'}}>
              Radar
            </StyledText>
            <Image
              source={{ uri: getCurrentWeatherMapSrc() }}
              style={{ width: '90vw', height: '90vw', borderColor: colors.lighter, borderWidth: 1 }}
            />
          </>
        ) : undefined}
      </>
    </Pressable>
  );
}

export default CurrentWeatherView;

const styles = StyleSheet.create({
  currentWeather: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  temps: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  temp: {
    fontSize: 64,
    color: colors.dark,
  },
  icon: {
    width: 100,
    height: 100
  }
});