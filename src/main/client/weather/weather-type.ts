export type WeatherType = {
  id: string,
  label: string,
  hash: number
};

export const CLEAR: WeatherType = {
  id: 'CLEAR',
  label: 'Clear',
  hash: GetHashKey('CLEAR')
};

export const SUNNY: WeatherType = {
  id: 'EXTRASUNNY',
  label: 'Sunny',
  hash: GetHashKey('EXTRASUNNY')
};

export const CLOUDY: WeatherType = {
  id: 'CLOUDS',
  label: 'Cloudy',
  hash: GetHashKey('CLOUDS')
};

export const OVERCAST: WeatherType = {
  id: 'OVERCAST',
  label: 'Overcast',
  hash: GetHashKey('OVERCAST')
};

export const RAINY: WeatherType = {
  id: 'RAIN',
  label: 'Rainy',
  hash: GetHashKey('RAIN')
};

export const CLEARING: WeatherType = {
  id: 'CLEARING',
  label: 'Clearing',
  hash: GetHashKey('CLEARING')
};

export const THUNDER: WeatherType = {
  id: 'THUNDER',
  label: 'Thunder',
  hash: GetHashKey('THUNDER')
};

export const SMOG: WeatherType = {
  id: 'SMOG',
  label: 'Smog',
  hash: GetHashKey('SMOG')
};

export const FOGGY: WeatherType = {
  id: 'FOGGY',
  label: 'Foggy',
  hash: GetHashKey('FOGGY')
};

export const XMAS: WeatherType = {
  id: 'XMAS',
  label: 'Snowy (XMAS)',
  hash: GetHashKey('XMAS')
};

export const SNOWY: WeatherType = {
  id: 'SNOW',
  label: 'Snowy',
  hash: GetHashKey('SNOW')
};

export const LIGHT_SNOW: WeatherType = {
  id: 'SNOWLIGHT',
  label: 'Light Snow',
  hash: GetHashKey('SNOWLIGHT')
};

export const BLIZZARD: WeatherType = {
  id: 'BLIZZARD',
  label: 'Blizzard',
  hash: GetHashKey('BLIZZARD')
};

export const NEUTRAL: WeatherType = {
  id: 'NEUTRAL',
  label: 'Neutral',
  hash: GetHashKey('NEUTRAL')
};

export const HALLOWEEN: WeatherType = {
  id: 'HALLOWEEN',
  label: 'Halloween',
  hash: GetHashKey('HALLOWEEN')
};

export const HALLOWEEN_RAINY: WeatherType = {
  id: 'RAIN_HALLOWEEN',
  label: 'Halloween - Rainy',
  hash: GetHashKey('RAIN_HALLOWEEN')
};

export const HALLOWEEN_SNOWY: WeatherType = {
  id: 'SNOW_HALLOWEEN',
  label: 'Halloween - Snowy',
  hash: GetHashKey('SNOW_HALLOWEEN')
};

export const SNOW_TYPES: WeatherType[] = [
  XMAS,
  SNOWY,
  LIGHT_SNOW,
  BLIZZARD,
  HALLOWEEN_SNOWY
];

export const SELECTABLE_WEATHER_TYPES: WeatherType[] = [
  SUNNY,
  RAINY,
  XMAS
];
