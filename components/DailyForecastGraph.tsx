import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { DailyWeather, Weather } from '../api/models';
import * as d3scale from "d3-scale";
import * as d3shape from "d3-shape";
import Svg, { Defs, G, LinearGradient, Path, Stop, Text } from "react-native-svg";
import { useColorSchemePalette } from './Colors';
import StyledText from './StyledText';
import WeatherIcon from './WeatherIcon';
import { getDayOfWeek } from '../utils/common';
import { SettingsContext } from './SettingsContext';

interface DailyForecastProps {
  daily: DailyWeather[];
}

interface TemperatureData {
  date: Date;
  feels_like: number;
  temp: number;
}

interface PopData {
  date: Date;
  pop: number;
}

const DailyForecastGraph: React.FC<DailyForecastProps> = (props: DailyForecastProps) => {
  const daily = props.daily;

  // have a color context that uses the settings context
  const { darkMode } = useContext(SettingsContext);
  const { colors } = useColorSchemePalette(darkMode);

  const width = Dimensions.get("window").width - 16;
  const height = 124;

  const temperatureData: TemperatureData[] = daily.flatMap(day => {
    const dayDate = new Date(day.dt * 1000);
    return [
      {
        date: new Date(dayDate.setHours(4)),
        temp: day.temp.morn,
        feels_like: day.feels_like.morn,
      },
      {
        date: new Date(dayDate.setHours(10)),
        temp: day.temp.day,
        feels_like: day.feels_like.day
      },
      {
        date: new Date(dayDate.setHours(16)),
        temp: day.temp.eve,
        feels_like: day.feels_like.eve,
      },
      {
        date: new Date(dayDate.setHours(22)),
        temp: day.temp.night,
        feels_like: day.feels_like.night,
      }
    ];
  });

  const popData: PopData[] = daily.map(day => {
    const dayDate = new Date(day.dt * 1000);
    return {
      date: new Date(dayDate.setHours(12)),
      pop: day.pop
    };
  });

  const scaleDate = d3scale.scaleTime()
    .domain([temperatureData[0].date, temperatureData[temperatureData.length - 1].date])
    .range([12, width - 8]);


  const forecastSortedPrecip = [...popData].sort((a, b) => b.pop - a.pop);
  const highPrecip = forecastSortedPrecip[0];

  const hasChanceOfPrecip = highPrecip.pop > 0;

  const temperatures = temperatureData.map(t => t.temp);
  const scaleTemp = d3scale.scaleLinear()
    .domain([Math.min(...temperatures), Math.max(...temperatures)])
    .range([height - 24, hasChanceOfPrecip ? 36 : 12]);

  const tempPath = d3shape.line(
      (d: TemperatureData) => scaleDate(d.date),
      (d: TemperatureData) => scaleTemp(d.temp))
    .curve(d3shape.curveBumpX)
    (temperatureData);

  const scalePercentage = d3scale.scaleLinear()
    .domain([0, 1])
    .range([height, 12]);

  const popFillPath = d3shape.line(
    (d: PopData) => scaleDate(d.date),
    (d: PopData) => scalePercentage(d.pop))
    .curve(d3shape.curveBumpX)
  ([
    { date: new Date(popData[0].date.setHours(4)), pop: 0 }, // start at 0 to fill area below percentage
    ...popData,
    { date: new Date(popData[popData.length - 1].date.setHours(23)), pop: 0 } // end at 0 to fill area below percentage
  ]);

  const popLinePath = d3shape.line(
    (d: PopData) => scaleDate(d.date),
    (d: PopData) => scalePercentage(d.pop))
    .curve(d3shape.curveBumpX)
  (popData);

  const days = daily.map(day => {
    const date = new Date(day.dt * 1000);
    return {
      x: scaleDate(date),
      label: getDayOfWeek(date)[0],
      weather: day.weather
    }
  });

  const labels = daily.flatMap((day, index) => {
    const date = new Date(day.dt * 1000);
    return [
      {
        x: scaleDate(new Date(date.setHours(11))),
        y: scaleTemp(day.temp.day) - 5,
        text: `${Math.round(day.temp.day)}`
      },
      {
        x: scaleDate(new Date(date.setHours(23))),
        y: scaleTemp(day.temp.night) + 10,
        text: `${Math.round(day.temp.night)}`
      }
    ];
  });

  return (
    <View style={styles.wrapper}>
      <StyledText style={{ fontWeight: '700', marginBottom: 8 }}>
        This Week
      </StyledText>
      <Svg width={width} height={height} style={{ marginLeft: -8 }}>
        <Defs>
          <LinearGradient
            id="precipitationGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <Stop
              offset="0%"
              stopColor={colors.rain}
              stopOpacity="0.9"
            />
            <Stop
              offset="90%"
              stopColor={colors.rain}
              stopOpacity="0.2"
            />
            <Stop
              offset="100%"
              stopColor={colors.rain}
              stopOpacity="0"
            />
          </LinearGradient>
        </Defs>
        <G x={0} y={0}>
          { tempPath ? (
            <Path
              d={tempPath}
              stroke={colors.onBackground}
              fill="none"
            />
          ) : undefined }
          { labels.map((label, index) => (
            <Text
              key={index}
              x={label.x}
              y={label.y}
              fontSize={10}
              textAnchor="middle"
              fill={colors.onBackground}
            >
              {label.text}
            </Text>
          ))}
          { (popFillPath && popLinePath && hasChanceOfPrecip) ? (
            <>
              <Path
                d={popFillPath}
                fill="url(#precipitationGradient)"
                fillOpacity={0.3}
              />
              <Path
                d={popLinePath}
                stroke="url(#precipitationGradient)"
                fill="none"
              />
            </>
          ) : undefined }
        </G>
      </Svg>
      <View style={{ width: width, position: "relative", height: 40, marginLeft: -8 }}>
        {days.map((day, index) => (
          <View key={index} style={{ position: "absolute", left: day.x - 12, width: 24 }}>
            <StyledText style={{ fontSize: 12, textAlign: "center" }}>
              {day.label}
            </StyledText>
            <WeatherIcon conditionId={day.weather[0].id} style={{ width: 24, height: 24 }} />
          </View>
        ))}
      </View>
    </View>
  );
}

export default DailyForecastGraph;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  }
});