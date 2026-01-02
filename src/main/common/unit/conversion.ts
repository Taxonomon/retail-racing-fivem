import {KILOMETERS_PER_HOUR, METERS_PER_SECOND, MILES_PER_HOUR, Unit} from "./unit";

type UnitConversionRatio = {
  from: Unit,
  to: Unit,
  factor: number;
};

const RATIOS: UnitConversionRatio[] = [
  {
    from: METERS_PER_SECOND,
    to: MILES_PER_HOUR,
    factor: 2.236936
  },
  {
    from: METERS_PER_SECOND,
    to: KILOMETERS_PER_HOUR,
    factor: 3.6
  }
];

function convert(value: number, from: Unit, to: Unit) {
  if (from === to) {
    return value;
  }

  const ratio = RATIOS.find((ratio) => from === ratio.from && to === ratio.to);

  if (undefined === ratio) {
    throw new Error(`no conversion ratio found from "${from.symbol}" to "${to.symbol}"`);
  }

  return value * ratio.factor;
}

const unitConverter = { convert };

export default unitConverter;
