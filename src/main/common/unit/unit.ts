export type Unit = {
  identifier: string;
  label: string;
  symbol: string;
};

export const METERS_PER_SECOND: Unit = {
  identifier: 'METERS_PER_SECOND',
  label: 'Meters per second',
  symbol: 'm/s'
};

export const KILOMETERS_PER_HOUR: Unit = {
  identifier: 'KILOMETERS_PER_HOUR',
  label: 'Kilometers per hour',
  symbol: 'km/h'
};

export const MILES_PER_HOUR: Unit = {
  identifier: 'MILES_PER_HOUR',
  label: 'Miles per hour',
  symbol: 'mph'
};

export const METER: Unit = {
  identifier: 'METER',
  label: 'Meter',
  symbol: 'm'
};

export const UNITS: Unit[] = [
  METERS_PER_SECOND,
  KILOMETERS_PER_HOUR,
  MILES_PER_HOUR,
  METER
];
