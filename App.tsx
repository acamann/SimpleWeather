import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
import { OneCallWeatherResponse } from './api/models';
import { getCurrentWeather } from './api/OpenWeatherMap';
import { colors } from './components/Colors';
import StyledText from './components/StyledText';
import WeatherCondition from './components/WeatherCondition';
import WeatherIcon from './components/WeatherIcon';

const formatTemp = (temp: number): string => `${Math.round(temp)} \u00B0F`;
const formatDateFromUnix = (dt: number): string => new Date(dt * 1000).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })
const formatTimeFromUnix = (dt: number): string => new Date(dt * 1000).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' });
const formatPercent = (float: number): string => `${Math.floor(float*100)}%`

export default function App() {
  const [weather, setWeather] = useState<OneCallWeatherResponse>();

  const [isZoomingHourly, setIsZoomingHourly] = useState<boolean>(false);
  const [isZoomingDaily, setIsZoomingDaily] = useState<boolean>(false);

  useEffect(() => {
    getCurrentWeather({
      onSuccess: (weather): void => setWeather(weather),
      onFailure: (error): void => console.log(["It didn't work!", error]),
    })
  }, []);

  const toggleHourlyZoom = (): void => {
    setIsZoomingHourly(isZooming => !isZooming);
  }

  const toggleDailyZoom = (): void => {
    setIsZoomingDaily(isZooming => !isZooming);
  }

  const dailyForecast = useMemo(() => 
    weather === undefined || isZoomingHourly ? [] : weather.daily.slice(0, isZoomingDaily ? 7 : 4)
  , [weather, isZoomingHourly, isZoomingDaily]);

  const hourlyForecast = useMemo(() => 
    weather === undefined ? [] : weather.hourly.slice(0, isZoomingDaily ? 6 : isZoomingHourly ? 18 : 12)
  , [weather, isZoomingHourly, isZoomingDaily]);

  return (
    <View style={styles.container}>
      { weather ? (
        <>
          <View style={styles.current}>
            <WeatherIcon
              style={styles.icon}
              conditionId={weather.current.weather[0]?.id}
            />
            <View style={styles.currentTemps}>
              <StyledText style={styles.temp}>
                {formatTemp(weather.current.temp)}
              </StyledText>
              <StyledText>
                {weather.current.weather.length > 0 ? (
                  `${weather.current.weather[0].description}, `
                ) : undefined}
                feels like {formatTemp(weather.current.feels_like)}
              </StyledText>
            </View>
          </View>
          <TouchableHighlight onPress={toggleHourlyZoom} style={{ padding: 0 }}>
            <View style={styles.forecastWrapper}>
              {hourlyForecast.map(hour => (
                <View style={styles.forecast} key={hour.dt.toString()}>
                  <StyledText style={styles.forecastDateTime}>
                    {formatTimeFromUnix(hour.dt)}
                  </StyledText>
                  <StyledText>
                    {formatTemp(hour.temp)}
                  </StyledText>
                  <StyledText style={{ width: 30 }}>
                    {hour.pop > 0 ? formatPercent(hour.pop) : undefined}
                  </StyledText>
                  <StyledText style={{ width: 30 }}>
                    {hour.rain ? `${hour.rain["1h"]}` : undefined}
                  </StyledText>
                  <WeatherCondition weather={hour.weather} />
                </View>
              ))}
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={toggleDailyZoom}>
            <View
              style={styles.forecastWrapper}
              onResponderStart={toggleDailyZoom}
            >
              {dailyForecast.map(day => (
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
          </TouchableHighlight>
        </>
      ) : undefined }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: colors.back,
    color: colors.dark,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  current: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  currentTemps: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  temp: {
    fontSize: 64,
    color: colors.dark,
  },
  forecastWrapper: {
    width: '100%'
  },
  icon: {
    width: 100,
    height: 100
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
