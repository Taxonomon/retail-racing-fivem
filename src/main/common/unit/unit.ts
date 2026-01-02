export type Unit = {
  symbol: string;
};

export const METERS_PER_SECOND: Unit = { symbol: 'm/s' };
export const KILOMETERS_PER_HOUR: Unit = { symbol: 'km/h' };
export const MILES_PER_HOUR: Unit = { symbol: 'mph' };
export const METER: Unit = { symbol: 'm' };

export const UNITS: Unit[] = [
  METERS_PER_SECOND,
  KILOMETERS_PER_HOUR,
  MILES_PER_HOUR,
  METER
];
