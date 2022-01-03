import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { DailyWeather, Weather } from '../api/models';
import * as d3scale from "d3-scale";
import * as d3shape from "d3-shape";
import Svg, { G, Path, Text } from "react-native-svg";
import { colors } from './Colors';
import StyledText from './StyledText';
import WeatherIcon from './WeatherIcon';
import { getDayOfWeek } from '../utils/common';

interface DailyForecastProps {
  daily: DailyWeather[];
}

const DailyForecastGraph: React.FC<DailyForecastProps> = (props: DailyForecastProps) => {
  const daily = props.daily;

  const width = Dimensions.get("window").width - 24;
  const height = 124;

  const forecastData = daily.flatMap(day => {
    const dayDate = new Date(day.dt * 1000);
    return [
      {
        date: new Date(dayDate.setHours(5)),
        value: day.temp.morn,
      },
      {
        date: new Date(dayDate.setHours(11)),
        value: day.temp.day,
      },
      {
        date: new Date(dayDate.setHours(17)),
        value: day.temp.eve,
      },
      {
        date: new Date(dayDate.setHours(23)),
        value: day.temp.night,
      }
    ];
  });

  const scaleX = d3scale.scaleTime()
    .domain([forecastData[0].date, forecastData[forecastData.length - 1].date])
    .range([12, width - 24]);

  const temperatures = forecastData.map(t => t.value);
  const scaleY = d3scale.scaleLinear()
    .domain([Math.min(...temperatures), Math.max(...temperatures)])
    .range([height - 24, 12]);

  const line = d3shape.line(
      (d: { date: Date, value: number }) => scaleX(d.date),
      (d: { date: Date, value: number }) => scaleY(d.value))
    .curve(d3shape.curveBumpX)
    (forecastData);

  const days = daily.map(day => {
    const date = new Date(day.dt * 1000);
    return {
      x: scaleX(date),
      label: getDayOfWeek(date)[0],
      weather: day.weather
    }
  });

  const labels = daily.flatMap((day, index) => {
    const date = new Date(day.dt * 1000);
    return [
      {
        x: scaleX(new Date(date.setHours(11))),
        y: scaleY(day.temp.day) - 5,
        text: `${Math.round(day.temp.day)}`
      },
      {
        x: scaleX(new Date(date.setHours(23))),
        y: scaleY(day.temp.night) + 10,
        text: `${Math.round(day.temp.night)}`
      }
    ];
  });

  return (
    <View style={styles.wrapper}>
      <StyledText style={{ fontWeight: '700', marginBottom: 16 }}>
        This Week
      </StyledText>
      <Svg width={width} height={height}>
        <G x={0} y={0}>
          { line ? (
            <Path
              d={line}
              stroke={colors.light}
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
              fill={colors.dark}
            >
              {label.text}
            </Text>
          ))}
        </G>
      </Svg>
      <View style={{ position: "relative", height: 40 }}>
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