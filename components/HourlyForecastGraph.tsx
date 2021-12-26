import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HourlyWeather, Weather } from '../api/models';
import * as d3scale from "d3-scale";
import * as d3shape from "d3-shape";
import Svg, { G, Path, Text } from "react-native-svg";
import { colors } from './Colors';
import StyledText from './StyledText';
import WeatherIcon from './WeatherIcon';
import { formatPercent, formatTemp } from '../utils/common';

interface HourlyForecastGraphProps {
  hourly: HourlyWeather[];
}

interface ForecastData {
  date: Date;
  feels_like: number;
  pop: number;
  rain: number;
}

interface Label {
  x: number;
  y: number;
  text: string;
}

const HourlyForecastGraph: React.FC<HourlyForecastGraphProps> = (props: HourlyForecastGraphProps) => {
  const hourly = props.hourly.slice(0, 24);

  const [temperaturePath, setTemperaturePath] = React.useState<string | null>(null);
  const [popPath, setPopPath] = React.useState<string | null>(null);
  const [hours, setHours] = React.useState<{ x: number, label?: string, weather?: Weather }[]>([]);
  const [tempLabels, setTempLabels] = React.useState<Label[]>([]);
  const [popLabels, setPopLabels] = React.useState<Label[]>([]);
  const [width, setWidth] = React.useState<number>(0);
  const height = 100;

  React.useEffect(() => {
    const forecastData: ForecastData[] = hourly.map(hour => ({
      date: new Date(hour.dt * 1000),
      feels_like: hour.feels_like,
      pop: hour.pop,
      rain: hour.rain?.['1h'] ?? 0
    }));

    const scaleDate = d3scale.scaleTime()
      .domain([forecastData[0].date, forecastData[forecastData.length - 1].date])
      .range([0, width]);

    const forecastSortedDesc = [...forecastData].sort((a, b) => b.feels_like - a.feels_like);
    const low = forecastSortedDesc[forecastSortedDesc.length - 1];
    const high = forecastSortedDesc[0];
    const scaleTemps = d3scale.scaleLinear()
      .domain([low.feels_like, high.feels_like])
      .range([height, 0]);

    const scalePercentage = d3scale.scaleLinear().domain([0, 1]).range([height, 0]);

    setTemperaturePath(d3shape.line(
        (d: ForecastData) => scaleDate(d.date),
        (d: ForecastData) => scaleTemps(d.feels_like))
      .curve(d3shape.curveBumpX)
      (forecastData));

    setPopPath(d3shape.line(
      (d: ForecastData) => scaleDate(d.date),
      (d: ForecastData) => scalePercentage(d.pop))
      .curve(d3shape.curveBumpX)
    ([
      { date: forecastData[0].date, pop: 0, feels_like: 0, rain: 0 }, // start at 0 to fill area below percentage
      ...forecastData,
      { date: forecastData[forecastData.length - 1].date, pop: 0, feels_like: 0, rain: 0 } // end at 0 to fill area below percentage
    ]));

    setHours(hourly.map((hour, index, allHours) => {
      //const previous = index > 0 ? allHours[index - 1] : undefined;
      const hourDate = new Date(hour.dt * 1000);
      return {
        x: scaleDate(hourDate),
        label: index % 3 === 1 ? hourDate.toLocaleTimeString("en-US", { hour: 'numeric' }) : undefined,
        weather: index % 3 === 1 ? hour.weather[0] : undefined // or hour.weather[0].id !== previous?.weather[0].id
      }
    }));

    // Temperature Labels
    setTempLabels([
      {
        x: scaleDate(high.date),
        y: scaleTemps(high.feels_like) + 10,
        text: formatTemp(high.feels_like)
      },
      {
        x: scaleDate(low.date),
        y: scaleTemps(low.feels_like) + 10,
        text: formatTemp(low.feels_like)
      }
    ]);

    // Precipitation labels
    const forecastSortedPrecip = [...forecastData].sort((a, b) => b.pop - a.pop);
    const popLabels: Label[] = [];

    const highPrecip = forecastSortedPrecip[0];
    if (highPrecip.pop > 0) {
      popLabels.push({
        x: scaleDate(highPrecip.date),
        y: scalePercentage(highPrecip.pop),
        text: formatPercent(highPrecip.pop)
      })
    }

    const lowPrecip = forecastSortedPrecip[forecastSortedPrecip.length - 1];
    if (lowPrecip.pop > 0) {
      popLabels.push({
        x: scaleDate(lowPrecip.date),
        y: scalePercentage(lowPrecip.pop),
        text: formatPercent(lowPrecip.pop)
      })
    }

    setPopLabels(popLabels);

  }, [width]);

  return (
    <View style={styles.wrapper} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <StyledText style={{ fontWeight: '700' }}>
        Today
      </StyledText>
      <Svg width={width} height={height} style={{ overflow: "visible", marginVertical: "24px" }}>
        { width > 0 ? (
          <G x={0} y={0}>
            { temperaturePath ? (
              <Path
                d={temperaturePath}
                stroke={colors.light}
                fill="none"
              />
             ) : undefined }
            { tempLabels.map((label, index) => (
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
            { (popPath && popLabels.length > 0) ? (
              <Path
                d={popPath}
                stroke="#2f6690"
                fill="#3a7ca5"
                fillOpacity={0.1}
                strokeOpacity={0.5}
              />
             ) : undefined }
             { popLabels.map((label, index) => (
              <Text
                key={index}
                x={label.x}
                y={label.y}
                fontSize={10}
                textAnchor="middle"
                fontFamily="Roboto, Helvetica, Arial, sans-serif"
                fill="#2f6690"
              >
                {label.text}
              </Text>
             ))}
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