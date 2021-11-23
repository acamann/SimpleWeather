module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module:react-native-dotenv", {
          moduleName: "react-native-dotenv",
          path: ".env",
          whitelist: ['OPEN_WEATHER_MAP_API_KEY', 'REACT_APP_MAPBOX_ACCESS_TOKEN'],
        }
      ]
    ],
  };
};
