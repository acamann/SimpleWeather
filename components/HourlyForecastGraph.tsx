import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HourlyWeather, Weather } from '../api/models';
import * as d3scale from "d3-scale";
import * as d3shape from "d3-shape";
import Svg, { G, Path } from "react-native-svg";
import { colors } from './Colors';
import StyledText from './StyledText';
import WeatherIcon from './WeatherIcon';

interface HourlyForecastGraphProps {
  hourly: HourlyWeather[];
}

const HourlyForecastGraph: React.FC<HourlyForecastGraphProps> = (props: HourlyForecastGraphProps) => {
  const hourly = props.hourly.slice(0, 24);

  const [line, setLine] = React.useState<string | null>(null);
  const [hours, setHours] = React.useState<{ x: number, label?: string, weather?: Weather }[]>([]);
  const [width, setWidth] = React.useState<number>(0);
  const height = 80;

  React.useEffect(() => {
    const forecastData = hourly.map(hour => ({
      date: new Date(hour.dt * 1000),
      value: hour.feels_like
    }));

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

    setHours(hourly.map((hour, index, allHours) => {
      const previous = index > 0 ? allHours[index - 1] : undefined;
      const hourDate = new Date(hour.dt * 1000);
      return {
        x: scaleX(hourDate),
        label: index % 3 === 1 ? hourDate.toLocaleTimeString("en-US", { hour: 'numeric' }) : undefined,
        weather: index % 3 === 1 ? hour.weather[0] : undefined // or hour.weather[0].id !== previous?.weather[0].id
      }
    }));
  }, [width]);

  return (
    <View style={styles.wrapper} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <StyledText style={{ fontWeight: '700' }}>
        Today
      </StyledText>
      <Svg width={width} height={height}>
        { width > 0 ? (
          <G x={0} y={0}>
            { line ? <Path d={line} stroke={colors.light} fill="none" /> : undefined }
          </G>
        ) : undefined}
      </Svg>
      <View style={{ position: "relative", height: 40 }}>
        {hours.map((hour, index) => (
          <View key={index} style={{ position: "absolute", left: hour.x - 18, width: 36, display: "flex", alignItems: "center" }}>
            <StyledText style={{ fontSize: 10 }}>
              {hour.label}
            </StyledText>
            <WeatherIcon conditionId={hour.weather?.id} style={{ width: 24, height: 24 }} />
          </View>
        ))}
      </View>
    </View>
  );
}

export default HourlyForecastGraph;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  }
});