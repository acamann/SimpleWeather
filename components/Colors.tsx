// colors from https://color.adobe.com/explore;

import { ColorSchemeName, useColorScheme } from "react-native"

const CoolGrey = {
  Neutral50: "#F5F7FA",
  Neutral100: "#E4E7EB",
  Neutral200: "#CBD2D9",
  Neutral300: "#9AA5B1",
  Neutral400: "#7B8794",
  Neutral500: "#616E7C",
  Neutral600: "#52606D",
  Neutral700: "#3E4C59",
  Neutral800: "#323F4B",
  Neutral900: "#1F2933",
}

type Palette = {
  primary: string;
  secondary: string;
  back: string;
  onBackground: string;
}

const main = {
  primary: "#303F9F",
  secondary: "#BDBDBD",
  // success: "#00897B", // confirm
  // warning: "#303F9F", // warning
  // error: "#C62828", // remove
  // info: "#673AB7", // help
}

// export const colors = {
//   accent: '#FAD41B',
//   back: '#FAF8EB',
//   dark: '#54565B',
//   light: '#76777B',
//   lighter: '#939598',
// };

export const light: Palette = {
  ...main,
  back: CoolGrey.Neutral50,
  onBackground: CoolGrey.Neutral800,
  //surface: CoolGrey.Neutral100,
  //onPrimary: CoolGrey.Neutral800,
  //onSecondary: CoolGrey.Neutral500,
}

export const dark: Palette = {
  ...main,
  back: CoolGrey.Neutral900,
  onBackground: CoolGrey.Neutral100,
  //surface: CoolGrey.Neutral100,
  //onPrimary: CoolGrey.Neutral800,
  //onSecondary: CoolGrey.Neutral500,
}

// high emphasis: 87% opacity
// medium emphasis: 60% opacity
// disabled: 38% opacity

export const useColorSchemePalette = (): { theme: ColorSchemeName, colors: Palette } => {
  const theme = useColorScheme();  
  return { theme, colors: theme === "dark" ? dark : light }
}