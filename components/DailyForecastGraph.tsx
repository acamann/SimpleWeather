import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DailyWeather, Weather } from '../api/models';
import * as d3scale from "d3-scale";
import * as d3shape from "d3-shape";
import Svg, { G, Path, Text } from "react-native-svg";
import { colors } from './Colors';
import StyledText from './StyledText';
import WeatherIcon from './WeatherIcon';

interface DailyForecastProps {
  daily: DailyWeather[];
}

const DailyForecastGraph: React.FC<DailyForecastProps> = (props: DailyForecastProps) => {
  const daily = props.daily;

  const [line, setLine] = React.useState<string | null>(null);
  const [days, setDays] = React.useState<{ x: number, label: string, weather: Weather[] }[]>([]);
  const [labels, setLabels] = React.useState<{ x: number, y: number, text: string }[]>([]);
  const [width, setWidth] = React.useState<number>(0);
  const height = 80;

  React.useEffect(() => {
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
      .range([0, width]);

    const temperatures = forecastData.map(t => t.value);
    const scaleY = d3scale.scaleLinear()
      .domain([Math.min(...temperatures), Math.max(...temperatures)])
      .range([height, 0]);

    setLine(d3shape.line(
        (d: { date: Date, value: number }) => scaleX(d.date),
        (d: { date: Date, value: number }) => scaleY(d.value))
      .curve(d3shape.curveBumpX)
      (forecastData));

    setDays(daily.map(day => {
      const date = new Date(day.dt * 1000);
      return {
        x: scaleX(date),
        label: date.toLocaleDateString("en-US", { weekday: 'short' })[0],
        weather: day.weather
      }
    }));

    setLabels(daily.flatMap((day, index) => {
      const date = new Date(day.dt * 1000);
      const labels = [
        {
          x: scaleX(new Date(date.setHours(11))),
          y: scaleY(day.temp.max) + 10,
          text: `${Math.round(day.temp.max)}`
        }
      ];
      if (index > 0) {
        labels.push({
          x: scaleX(new Date(date.setHours(6))),
          y: scaleY(day.temp.min) + 10,
          text: `${Math.round(day.temp.min)}`
        })
      }
      return labels;
    }));
  }, [width]);

  return (
    <View style={styles.wrapper} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <StyledText style={{ fontWeight: '700' }}>
        This Week
      </StyledText>
      <Svg width={width} height={height} style={{ overflow: "visible", marginVertical: "24px" }}>
        { width > 0 ? (
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
                fontFamily="Roboto, Helvetica, Arial, sans-serif"
                fill={colors.dark}
              >
                {label.text}
              </Text>
            ))}
          </G>
        ) : undefined}
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