/**
 * Extracted from `mission.race.type`, which only exists if `mission.gen.type = 2` (= race).
 */
export type RaceType = {
  id: number;
  label: string;
};

export const LAND: RaceType = {
  id: 0,
  label: 'Land'
};

export const POINT_TO_POINT: RaceType = {
  id: 1,
  label: 'Point To Point'
};

export const SEA: RaceType = {
  id: 3,
  label: 'Sea'
};

export const AIR: RaceType = {
  id: 5,
  label: 'Air'
};

export const STUNT: RaceType = {
  id: 6,
  label: 'Stunt'
};

export const PARACHUTE: RaceType = {
  id: 8,
  label: 'Parachute'
};

export const BIKE: RaceType = {
  id: 13,
  label: 'Bike'
};

export const RACE_TYPES: RaceType[] = [
  LAND,
  POINT_TO_POINT,
  SEA,
  AIR,
  STUNT,
  PARACHUTE,
  BIKE
];

export function getRaceTypeById(id: number) {
  return RACE_TYPES.find(rt => rt.id === id);
}
