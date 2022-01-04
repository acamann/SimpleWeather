import React from 'react';
import Svg, { SvgProps, Path } from "react-native-svg"
import { useColorSchemePalette } from './Colors';

type WeatherIconProps = SvgProps & {
  conditionId?: number;
};

const WeatherIcon: React.FC<WeatherIconProps> = (props: WeatherIconProps) => {
  const { conditionId, ...rest } = props;
  const { colors } = useColorSchemePalette();
  return conditionId ? (
    <Svg
      viewBox="0 0 30 30"
      {...rest}
    >
      <Path d={conditionPathMap.get(conditionId)} fill={colors.onBackground} />
    </Svg>
  ) : null;
}

export default WeatherIcon;

// Alternative Weather Icons from https://erikflowers.github.io/weather-icons/
const thunderstormPath = "M4.63 16.91c0 1.11.33 2.1.99 2.97s1.52 1.47 2.58 1.79l-.66 1.68c-.03.14.02.22.14.22h2.13l-.98 4.3h.28l3.92-5.75c.04-.04.04-.09.01-.14-.03-.05-.08-.07-.15-.07h-2.18l2.48-4.64c.07-.14.02-.22-.14-.22h-2.94c-.09 0-.17.05-.23.15l-1.07 2.87c-.71-.18-1.3-.57-1.77-1.16s-.7-1.26-.7-2.01c0-.83.28-1.55.85-2.17.57-.61 1.27-.97 2.1-1.07l.53-.07c.13 0 .2-.06.2-.18l.07-.51c.11-1.08.56-1.99 1.37-2.72.81-.73 1.76-1.1 2.85-1.1s2.04.37 2.85 1.1c.82.73 1.28 1.64 1.4 2.72l.07.58c0 .11.06.17.18.17h1.6c.91 0 1.68.32 2.32.95.64.63.97 1.4.97 2.28 0 .85-.3 1.59-.89 2.21-.59.62-1.33.97-2.2 1.04-.13 0-.2.06-.2.18v1.37c0 .11.07.17.2.17 1.33-.04 2.46-.55 3.39-1.51s1.39-2.11 1.39-3.45c0-.9-.22-1.73-.67-2.49a4.884 4.884 0 0 0-1.81-1.8c-.77-.44-1.6-.66-2.5-.66h-.31c-.33-1.33-1.04-2.42-2.11-3.26s-2.3-1.27-3.68-1.27c-1.41 0-2.67.44-3.76 1.31s-1.79 1.99-2.1 3.36c-1.11.26-2.02.83-2.74 1.73s-1.08 1.95-1.08 3.1zm8.14 9.71c0 .39.19.65.58.77.01 0 .05 0 .11.01s.11.01.14.01c.17 0 .33-.05.49-.15.16-.1.27-.26.32-.48l2.25-8.69c.06-.24.04-.45-.07-.65a.827.827 0 0 0-.5-.39l-.26-.03c-.16 0-.32.05-.47.15a.74.74 0 0 0-.31.45l-2.26 8.72c-.01.1-.02.19-.02.28zm4.16-3.06c0 .13.03.26.1.38.14.22.31.37.51.44.11.03.21.05.3.05s.2-.02.32-.08c.21-.09.35-.28.42-.57l1.44-5.67c.03-.14.05-.23.05-.27 0-.15-.05-.3-.16-.45s-.26-.26-.46-.32l-.26-.03c-.17 0-.33.05-.47.15a.82.82 0 0 0-.3.45l-1.46 5.7c0 .02 0 .05-.01.11-.02.05-.02.08-.02.11z";
const lightningPath = "M7.96 24.51h.39l6.88-10.18c.09-.18.04-.27-.15-.27h-2.84l2.99-5.45c.09-.18.02-.27-.2-.27h-3.81c-.11 0-.2.06-.29.18l-2.78 7.4c-.02.18.04.27.19.27h2.75l-3.13 8.32zm8.5-6.33h.27l5.22-7.67c.05-.08.06-.15.04-.2s-.08-.07-.17-.07h-2.1l2.18-4.03c.12-.2.06-.3-.18-.3h-2.74c-.13 0-.23.06-.3.19l-2.08 5.48c-.03.09-.03.16.01.21.04.05.1.07.19.07h2.04l-2.38 6.32z";
const rainPath = "M4.64 16.91c0-1.15.36-2.17 1.08-3.07a4.82 4.82 0 0 1 2.73-1.73c.31-1.36 1.02-2.48 2.11-3.36s2.34-1.31 3.75-1.31c1.38 0 2.6.43 3.68 1.28 1.08.85 1.78 1.95 2.1 3.29h.32c.89 0 1.72.22 2.48.65s1.37 1.03 1.81 1.78c.44.75.67 1.58.67 2.47 0 .88-.21 1.69-.63 2.44-.42.75-1 1.35-1.73 1.8-.73.45-1.53.69-2.4.71-.13 0-.2-.06-.2-.17v-1.33c0-.12.07-.18.2-.18.85-.04 1.58-.38 2.18-1.02s.9-1.39.9-2.26-.33-1.62-.98-2.26-1.42-.96-2.31-.96h-1.61c-.12 0-.18-.06-.18-.17l-.08-.58a4.076 4.076 0 0 0-1.39-2.71c-.82-.73-1.76-1.09-2.85-1.09s-2.05.36-2.85 1.09a4.02 4.02 0 0 0-1.36 2.71l-.07.53c0 .12-.07.19-.2.19l-.53.03c-.83.1-1.53.46-2.1 1.07s-.85 1.33-.85 2.16c0 .87.3 1.62.9 2.26s1.33.98 2.18 1.02c.11 0 .17.06.17.18v1.33c0 .11-.06.17-.17.17-1.34-.06-2.47-.57-3.4-1.53s-1.37-2.1-1.37-3.43zm5.35 6.69c0-.04.01-.11.04-.2l1.63-5.77a.837.837 0 0 1 1.02-.56c.24.04.42.17.54.37.12.2.15.42.08.67l-1.63 5.73c-.12.43-.4.64-.82.64-.04 0-.07-.01-.11-.02-.06-.02-.09-.03-.1-.03a.831.831 0 0 1-.49-.33.895.895 0 0 1-.16-.5zm2.62 2.81 2.44-8.77c.04-.19.14-.34.3-.44.16-.1.32-.15.49-.15.09 0 .18.01.27.03.22.06.38.19.49.39.11.2.13.41.07.64l-2.43 8.78c-.04.17-.13.31-.29.43-.16.12-.32.18-.51.18-.09 0-.18-.02-.25-.05-.2-.05-.37-.18-.52-.39-.11-.18-.13-.39-.06-.65zm4.13-2.79c0-.04.01-.11.04-.23l1.63-5.77a.83.83 0 0 1 .3-.44c.15-.1.3-.15.46-.15.08 0 .17.01.26.03.21.06.36.16.46.31.1.15.15.31.15.47 0 .03-.01.08-.02.14s-.02.1-.02.12l-1.63 5.73c-.04.19-.13.35-.28.46s-.32.17-.51.17l-.24-.05a.809.809 0 0 1-.46-.32.916.916 0 0 1-.14-.47z";
const cloudyGustsPath = "M3.62 21.01c0-.25.08-.46.25-.63.17-.16.37-.24.6-.24h5.42c.74 0 1.37.26 1.89.79.52.53.78 1.16.78 1.9s-.26 1.38-.78 1.9-1.15.78-1.89.78-1.38-.26-1.9-.79a.806.806 0 0 1-.23-.6c0-.24.08-.45.23-.6.15-.16.35-.24.6-.24.23 0 .43.08.61.24.2.19.43.29.69.29s.49-.1.68-.29a.95.95 0 0 0 .29-.7c0-.26-.1-.49-.29-.68s-.42-.29-.68-.29H4.47c-.23 0-.43-.08-.6-.25s-.25-.35-.25-.59zm0-3.04c0-.24.08-.45.25-.62.17-.16.37-.24.6-.24h10.55c.26 0 .49-.1.68-.29.19-.19.29-.43.29-.69s-.1-.5-.29-.69a.939.939 0 0 0-.68-.29c-.28 0-.5.09-.68.28-.18.15-.39.23-.64.23-.24 0-.44-.08-.6-.23a.814.814 0 0 1-.23-.6c0-.25.07-.45.23-.61.51-.51 1.15-.76 1.92-.76.74 0 1.38.26 1.9.78s.78 1.15.78 1.88-.26 1.37-.78 1.89c-.52.52-1.15.78-1.9.78H4.47c-.24 0-.44-.08-.6-.24a.743.743 0 0 1-.25-.58zm2.15-2.36c0 .08.05.12.16.12h1.44c.08 0 .15-.05.22-.15.22-.54.58-.99 1.05-1.35.48-.36 1.01-.56 1.59-.6l.53-.08c.13 0 .2-.06.2-.17l.07-.52c.11-1.08.56-1.99 1.37-2.72s1.76-1.1 2.86-1.1c1.11 0 2.07.36 2.88 1.09.81.73 1.27 1.64 1.39 2.73l.07.59c0 .11.06.17.17.17h1.62c.91 0 1.68.32 2.33.96.65.64.97 1.4.97 2.3 0 .89-.32 1.66-.97 2.3-.65.64-1.42.96-2.33.96h-6.91c-.12 0-.19.06-.19.17v1.39c0 .11.06.17.19.17h6.91c.91 0 1.74-.22 2.51-.67.77-.44 1.37-1.05 1.82-1.81.45-.77.67-1.6.67-2.5 0-.91-.22-1.74-.67-2.5a4.938 4.938 0 0 0-1.82-1.81c-.77-.44-1.6-.67-2.51-.67h-.31c-.31-1.33-1.01-2.42-2.1-3.27-1.08-.85-2.33-1.27-3.73-1.27-1.41 0-2.66.44-3.75 1.32s-1.78 2-2.07 3.37c-.86.2-1.62.61-2.28 1.23s-1.12 1.36-1.38 2.21V15.61z";
const cloudyPath = "M3.89 17.6c0-.99.31-1.88.93-2.65s1.41-1.27 2.38-1.49c.26-1.17.85-2.14 1.78-2.88.93-.75 2-1.12 3.22-1.12 1.18 0 2.24.36 3.16 1.09.93.73 1.53 1.66 1.8 2.8h.27c1.18 0 2.18.41 3.01 1.24s1.25 1.83 1.25 3c0 1.18-.42 2.18-1.25 3.01s-1.83 1.25-3.01 1.25H8.16c-.58 0-1.13-.11-1.65-.34s-.99-.51-1.37-.89c-.38-.38-.68-.84-.91-1.36s-.34-1.09-.34-1.66zm1.45 0c0 .76.28 1.42.82 1.96s1.21.82 1.99.82h9.28c.77 0 1.44-.27 1.99-.82.55-.55.83-1.2.83-1.96s-.27-1.42-.83-1.96c-.55-.54-1.21-.82-1.99-.82h-1.39c-.1 0-.15-.05-.15-.15l-.07-.49c-.1-.94-.5-1.73-1.19-2.35s-1.51-.93-2.45-.93c-.94 0-1.76.31-2.46.94-.7.62-1.09 1.41-1.18 2.34l-.07.42c0 .1-.05.15-.16.15l-.45.07c-.72.06-1.32.36-1.81.89-.46.53-.71 1.16-.71 1.89zm8.85-8.72c-.1.09-.08.16.07.21.43.19.79.37 1.08.55.11.03.19.02.22-.03.61-.57 1.31-.86 2.12-.86s1.5.27 2.1.81c.59.54.92 1.21.99 2l.09.64h1.42c.65 0 1.21.23 1.68.7s.7 1.02.7 1.66c0 .6-.21 1.12-.62 1.57s-.92.7-1.53.77c-.1 0-.15.05-.15.16v1.13c0 .11.05.16.15.16 1.01-.06 1.86-.46 2.55-1.19s1.04-1.6 1.04-2.6c0-1.06-.37-1.96-1.12-2.7-.75-.75-1.65-1.12-2.7-1.12h-.15c-.26-1-.81-1.82-1.65-2.47-.83-.65-1.77-.97-2.8-.97-1.4-.01-2.57.52-3.49 1.58z";
const clearPath = "M4.37 14.62c0-.24.08-.45.25-.62.17-.16.38-.24.6-.24h2.04c.23 0 .42.08.58.25.15.17.23.37.23.61s-.07.44-.22.61c-.15.17-.35.25-.58.25H5.23c-.23 0-.43-.08-.6-.25a.832.832 0 0 1-.26-.61zm2.86 6.93c0-.23.08-.43.23-.61l1.47-1.43c.15-.16.35-.23.59-.23s.44.08.6.23.24.34.24.57c0 .24-.08.46-.24.64L8.7 22.14c-.41.32-.82.32-1.23 0a.807.807 0 0 1-.24-.59zm0-13.84c0-.23.08-.43.23-.61.2-.17.41-.25.64-.25.22 0 .42.08.59.24l1.43 1.47c.16.15.24.35.24.59s-.08.44-.24.6-.36.24-.6.24-.44-.08-.59-.24L7.47 8.32a.837.837 0 0 1-.24-.61zm2.55 6.91c0-.93.23-1.8.7-2.6s1.1-1.44 1.91-1.91 1.67-.7 2.6-.7c.7 0 1.37.14 2.02.42.64.28 1.2.65 1.66 1.12.47.47.84 1.02 1.11 1.66.27.64.41 1.32.41 2.02 0 .94-.23 1.81-.7 2.61-.47.8-1.1 1.43-1.9 1.9-.8.47-1.67.7-2.61.7s-1.81-.23-2.61-.7c-.8-.47-1.43-1.1-1.9-1.9-.45-.81-.69-1.68-.69-2.62zm1.7 0c0 .98.34 1.81 1.03 2.5.68.69 1.51 1.04 2.49 1.04s1.81-.35 2.5-1.04 1.04-1.52 1.04-2.5c0-.96-.35-1.78-1.04-2.47-.69-.68-1.52-1.02-2.5-1.02-.97 0-1.8.34-2.48 1.02-.7.69-1.04 1.51-1.04 2.47zm2.66 7.78c0-.24.08-.44.25-.6s.37-.24.6-.24c.24 0 .45.08.61.24s.24.36.24.6v1.99c0 .24-.08.45-.25.62-.17.17-.37.25-.6.25s-.44-.08-.6-.25a.845.845 0 0 1-.25-.62V22.4zm0-15.5V4.86c0-.23.08-.43.25-.6.17-.17.37-.26.61-.26s.43.08.6.25c.17.17.25.37.25.6V6.9c0 .23-.08.42-.25.58s-.37.23-.6.23-.44-.08-.6-.23-.26-.35-.26-.58zm5.52 13.18c0-.23.08-.42.23-.56.15-.16.34-.23.56-.23.24 0 .44.08.6.23l1.46 1.43c.16.17.24.38.24.61 0 .23-.08.43-.24.59-.4.31-.8.31-1.2 0l-1.42-1.42a.974.974 0 0 1-.23-.65zm0-10.92c0-.25.08-.45.23-.59l1.42-1.47a.84.84 0 0 1 .59-.24c.24 0 .44.08.6.25.17.17.25.37.25.6 0 .25-.08.46-.24.62l-1.46 1.43c-.18.16-.38.24-.6.24-.23 0-.41-.08-.56-.24s-.23-.36-.23-.6zm2.26 5.46c0-.24.08-.44.24-.62.16-.16.35-.24.57-.24h2.02c.23 0 .43.09.6.26.17.17.26.37.26.6s-.09.43-.26.6c-.17.17-.37.25-.6.25h-2.02c-.23 0-.43-.08-.58-.25s-.23-.36-.23-.6z";
const showersPath = "M4.6 16.93c0-1.16.36-2.18 1.09-3.08.72-.9 1.65-1.48 2.78-1.73.29-1.38.98-2.5 2.07-3.39S12.88 7.4 14.3 7.4c1.39 0 2.63.43 3.72 1.28 1.08.85 1.79 1.95 2.12 3.3h.34c.9 0 1.73.22 2.48.66.76.44 1.35 1.04 1.79 1.8.43.76.65 1.59.65 2.49 0 1.34-.46 2.48-1.37 3.44-.92.96-2.04 1.46-3.37 1.5-.12 0-.18-.06-.18-.17v-1.34c0-.11.06-.17.18-.17.84-.07 1.57-.42 2.17-1.05s.9-1.37.9-2.22c0-.89-.32-1.66-.96-2.31-.64-.64-1.4-.97-2.29-.97h-1.63c-.12 0-.19-.06-.22-.18l-.07-.57c-.07-.71-.3-1.36-.7-1.94a4.257 4.257 0 0 0-3.55-1.85c-1.1 0-2.05.36-2.86 1.09-.81.73-1.27 1.64-1.37 2.72l-.07.54c0 .09-.05.14-.16.14l-.54.11c-.84.07-1.55.41-2.11 1.03-.57.62-.85 1.35-.85 2.2 0 .87.3 1.62.89 2.25.59.63 1.31.97 2.17 1.02.12 0 .18.06.18.17v1.34c0 .11-.06.17-.18.17-.66-.03-1.28-.18-1.88-.45S6.42 20.8 6 20.36c-.43-.44-.77-.95-1.02-1.55s-.38-1.22-.38-1.88zm5.42 6.77c0-.03.01-.08.02-.13s.02-.09.02-.11l.27-1.03c.07-.22.2-.4.4-.51.2-.12.41-.14.64-.07.23.07.4.2.52.4s.14.41.07.64l-.24 1.01c-.13.44-.38.66-.76.66h-.09c-.03 0-.07-.01-.11-.01-.04-.01-.07-.01-.1-.01-.21-.06-.37-.18-.48-.34s-.16-.34-.16-.5zm1.32-4.82c0-.02 0-.06.01-.11s.01-.08.01-.09l.3-1.05c.06-.19.17-.34.32-.45.15-.1.31-.15.47-.15h.08c.03 0 .06.01.09.01.03.01.06.01.08.01.23.07.4.2.51.4.12.2.14.41.07.64l-.24 1c-.07.28-.2.47-.4.59s-.42.12-.65.02c-.22-.06-.38-.17-.49-.34s-.16-.32-.16-.48zm1.23 7.95c0-.03.01-.07.02-.13s.02-.09.02-.12l.29-.99c.06-.24.2-.42.4-.54.2-.12.42-.15.65-.08.23.07.39.2.51.41s.13.42.07.65l-.25 1.04c-.11.41-.37.61-.8.61-.05 0-.13-.01-.24-.04a.718.718 0 0 1-.49-.3.836.836 0 0 1-.18-.51zm1.34-4.77c0-.06.01-.14.04-.25l.27-1.03c.07-.23.2-.4.41-.51.2-.12.42-.14.65-.07a.805.805 0 0 1 .57 1.04l-.24.99c-.13.45-.37.68-.72.68-.04 0-.15-.02-.31-.06a.718.718 0 0 1-.49-.3.782.782 0 0 1-.18-.49zm2.82 1.68c0-.07.01-.15.03-.24l.28-.99c.07-.24.2-.42.41-.54s.41-.15.63-.09c.23.07.41.2.53.41.12.2.15.41.09.63l-.29 1.06c-.1.41-.36.61-.79.61-.09 0-.18-.01-.26-.03a.7.7 0 0 1-.46-.3c-.1-.18-.16-.35-.17-.52zm1.38-4.76c0-.03.02-.12.05-.26l.3-1.03c.04-.21.13-.37.29-.47.16-.1.32-.15.49-.14.04-.01.13 0 .24.03.22.05.39.18.52.38.12.17.14.38.07.65l-.24 1.03c-.13.43-.38.65-.76.65-.06 0-.17-.02-.34-.06a.823.823 0 0 1-.62-.78z";
const sprinklePath = "M4.64 16.91c0-1.15.36-2.17 1.08-3.07a4.82 4.82 0 0 1 2.73-1.73c.31-1.36 1.01-2.48 2.1-3.35s2.35-1.31 3.76-1.31c1.38 0 2.6.43 3.68 1.27A5.88 5.88 0 0 1 20.1 12h.31c.89 0 1.72.22 2.48.65s1.37 1.03 1.81 1.78c.44.75.67 1.58.67 2.47 0 1.34-.46 2.49-1.38 3.45s-2.05 1.47-3.38 1.51c-.13 0-.2-.06-.2-.17v-1.33c0-.12.07-.18.2-.18.86-.04 1.58-.38 2.18-1.02s.9-1.39.9-2.26-.32-1.62-.98-2.26c-.65-.64-1.42-.96-2.31-.96h-1.6c-.12 0-.19-.06-.19-.17l-.07-.58a4.108 4.108 0 0 0-1.38-2.71c-.82-.73-1.77-1.1-2.85-1.1-1.09 0-2.05.36-2.86 1.09-.81.73-1.27 1.63-1.38 2.71l-.06.54c0 .12-.07.18-.2.18l-.53.03c-.82.04-1.51.37-2.09 1s-.86 1.37-.86 2.22c0 .87.3 1.62.9 2.26s1.33.98 2.18 1.02c.11 0 .17.06.17.18v1.33c0 .11-.06.17-.17.17-1.34-.06-2.47-.57-3.4-1.53s-1.37-2.08-1.37-3.41zm5.93.88c0-.24.12-.57.37-.99.24-.42.47-.75.68-1.01.21-.24.34-.38.38-.42l.36.4c.26.28.5.61.72 1.02.22.4.33.74.33 1 0 .39-.13.72-.4.98s-.6.39-1 .39c-.39 0-.73-.13-1.01-.4-.29-.26-.43-.59-.43-.97zm2.98 3.99c0-.28.08-.59.24-.96s.35-.7.59-1.02c.18-.26.4-.54.67-.84.26-.3.46-.52.6-.65.07-.06.15-.14.24-.23l.24.23c.38.33.8.82 1.27 1.46.24.33.43.68.59 1.04s.23.68.23.97c0 .64-.23 1.19-.68 1.65s-1.01.68-1.66.68c-.64 0-1.19-.23-1.65-.67-.46-.46-.68-1.01-.68-1.66zm1.47-6.66c0-.42.32-.95.97-1.6l.24.25c.18.21.33.45.48.71.14.26.22.47.22.64 0 .26-.09.48-.28.66-.18.18-.4.28-.66.28-.27 0-.5-.09-.69-.28a.87.87 0 0 1-.28-.66z";

const conditionPathMap = new Map([
  [200, thunderstormPath],
  [201, thunderstormPath],
  [202, thunderstormPath],
  [210, lightningPath],
  [211, lightningPath],
  [212, lightningPath],
  [221, lightningPath],
  [230, thunderstormPath],
  [231, thunderstormPath],
  [232, thunderstormPath],
  [300, sprinklePath],
  [301, sprinklePath],
  [302, rainPath],
  [311, rainPath],
  [312, rainPath],
  [313, showersPath],
  [314, rainPath],
  [321, sprinklePath],
  [500, sprinklePath],
  [501, rainPath],
  [502, rainPath],
  [503, rainPath],
  [504, rainPath],
  [520, showersPath],
  [521, showersPath],
  [522, showersPath],
  [701, showersPath],
  [771, cloudyGustsPath],
  [800, clearPath],
  [801, cloudyGustsPath],
  [802, cloudyGustsPath],
  [803, cloudyGustsPath],
  [804, cloudyPath],
])

// const conditionIconMap = new Map([
//   [310, require("../assets/weather-icons/wi-rain-mix.svg")],
//   [511, require("../assets/weather-icons/wi-rain-mix.svg")],
//   [531, require("../assets/weather-icons/wi-storm-showers.svg")],
//   [600, require("../assets/weather-icons/wi-snow.svg")],
//   [601, require("../assets/weather-icons/wi-snow.svg")],
//   [602, require("../assets/weather-icons/wi-sleet.svg")],
//   [611, require("../assets/weather-icons/wi-rain-mix.svg")],
//   [612, require("../assets/weather-icons/wi-rain-mix.svg")],
//   [615, require("../assets/weather-icons/wi-rain-mix.svg")],
//   [616, require("../assets/weather-icons/wi-rain-mix.svg")],
//   [620, require("../assets/weather-icons/wi-rain-mix.svg")],
//   [621, require("../assets/weather-icons/wi-snow.svg")],
//   [622, require("../assets/weather-icons/wi-snow.svg")],
//   [711, require("../assets/weather-icons/wi-smoke.svg")],
//   [721, require("../assets/weather-icons/wi-day-haze.svg")],
//   [731, require("../assets/weather-icons/wi-dust.svg")],
//   [741, require("../assets/weather-icons/wi-fog.svg")],
//   [761, require("../assets/weather-icons/wi-dust.svg")],
//   [762, require("../assets/weather-icons/wi-dust.svg")],
//   [781, require("../assets/weather-icons/wi-tornado.svg")],
//   [900, require("../assets/weather-icons/wi-tornado.svg")],
//   [901, require("../assets/weather-icons/wi-storm-showers.svg")],
//   [902, require("../assets/weather-icons/wi-hurricane.svg")],
//   [903, require("../assets/weather-icons/wi-snowflake-cold.svg")],
//   [904, require("../assets/weather-icons/wi-hot.svg")],
//   [905, require("../assets/weather-icons/wi-windy.svg")],
//   [906, require("../assets/weather-icons/wi-hail.svg")],
//   [957, require("../assets/weather-icons/wi-strong-wind.svg")]
// ]);