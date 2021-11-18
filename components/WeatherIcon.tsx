import React from 'react';
import { Image, ImageProps } from 'react-native';

type WeatherIconProps = Omit<ImageProps, "source"> & {
  conditionId?: number;
};

// Alternative Weather Icons from https://erikflowers.github.io/weather-icons/
const WeatherIcon: React.FC<WeatherIconProps> = (props: WeatherIconProps) => {
  const conditionId = props.conditionId;
  return conditionId ? (
    <Image
      {...props}
      source={conditionIconMap.get(conditionId)}
    />
  ) : null;
}

export default WeatherIcon;

const conditionIconMap = new Map([
  [200, require("../assets/weather-icons/wi-thunderstorm.svg")],
  [201, require("../assets/weather-icons/wi-thunderstorm.svg")],
  [202, require("../assets/weather-icons/wi-thunderstorm.svg")],
  [210, require("../assets/weather-icons/wi-lightning.svg")],
  [211, require("../assets/weather-icons/wi-lightning.svg")],
  [212, require("../assets/weather-icons/wi-lightning.svg")],
  [221, require("../assets/weather-icons/wi-lightning.svg")],
  [230, require("../assets/weather-icons/wi-thunderstorm.svg")],
  [231, require("../assets/weather-icons/wi-thunderstorm.svg")],
  [232, require("../assets/weather-icons/wi-thunderstorm.svg")],
  [300, require("../assets/weather-icons/wi-sprinkle.svg")],
  [301, require("../assets/weather-icons/wi-sprinkle.svg")],
  [302, require("../assets/weather-icons/wi-rain.svg")],
  [310, require("../assets/weather-icons/wi-rain-mix.svg")],
  [311, require("../assets/weather-icons/wi-rain.svg")],
  [312, require("../assets/weather-icons/wi-rain.svg")],
  [313, require("../assets/weather-icons/wi-showers.svg")],
  [314, require("../assets/weather-icons/wi-rain.svg")],
  [321, require("../assets/weather-icons/wi-sprinkle.svg")],
  [500, require("../assets/weather-icons/wi-sprinkle.svg")],
  [501, require("../assets/weather-icons/wi-rain.svg")],
  [502, require("../assets/weather-icons/wi-rain.svg")],
  [503, require("../assets/weather-icons/wi-rain.svg")],
  [504, require("../assets/weather-icons/wi-rain.svg")],
  [511, require("../assets/weather-icons/wi-rain-mix.svg")],
  [520, require("../assets/weather-icons/wi-showers.svg")],
  [521, require("../assets/weather-icons/wi-showers.svg")],
  [522, require("../assets/weather-icons/wi-showers.svg")],
  [531, require("../assets/weather-icons/wi-storm-showers.svg")],
  [600, require("../assets/weather-icons/wi-snow.svg")],
  [601, require("../assets/weather-icons/wi-snow.svg")],
  [602, require("../assets/weather-icons/wi-sleet.svg")],
  [611, require("../assets/weather-icons/wi-rain-mix.svg")],
  [612, require("../assets/weather-icons/wi-rain-mix.svg")],
  [615, require("../assets/weather-icons/wi-rain-mix.svg")],
  [616, require("../assets/weather-icons/wi-rain-mix.svg")],
  [620, require("../assets/weather-icons/wi-rain-mix.svg")],
  [621, require("../assets/weather-icons/wi-snow.svg")],
  [622, require("../assets/weather-icons/wi-snow.svg")],
  [701, require("../assets/weather-icons/wi-showers.svg")],
  [711, require("../assets/weather-icons/wi-smoke.svg")],
  [721, require("../assets/weather-icons/wi-day-haze.svg")],
  [731, require("../assets/weather-icons/wi-dust.svg")],
  [741, require("../assets/weather-icons/wi-fog.svg")],
  [761, require("../assets/weather-icons/wi-dust.svg")],
  [762, require("../assets/weather-icons/wi-dust.svg")],
  [771, require("../assets/weather-icons/wi-cloudy-gusts.svg")],
  [781, require("../assets/weather-icons/wi-tornado.svg")],
  [800, require("../assets/weather-icons/wi-day-sunny.svg")],
  [801, require("../assets/weather-icons/wi-cloudy-gusts.svg")],
  [802, require("../assets/weather-icons/wi-cloudy-gusts.svg")],
  [803, require("../assets/weather-icons/wi-cloudy-gusts.svg")],
  [804, require("../assets/weather-icons/wi-cloudy.svg")],
  [900, require("../assets/weather-icons/wi-tornado.svg")],
  [901, require("../assets/weather-icons/wi-storm-showers.svg")],
  [902, require("../assets/weather-icons/wi-hurricane.svg")],
  [903, require("../assets/weather-icons/wi-snowflake-cold.svg")],
  [904, require("../assets/weather-icons/wi-hot.svg")],
  [905, require("../assets/weather-icons/wi-windy.svg")],
  [906, require("../assets/weather-icons/wi-hail.svg")],
  [957, require("../assets/weather-icons/wi-strong-wind.svg")]
]);