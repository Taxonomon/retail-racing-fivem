/**
 * R* race types are set in `mission.race.type`, which only exists if `mission.gen.type = 2` (= race).
 */
export type RaceType = {
  id: number;
  name: string;
};

export const LAND: RaceType = { id: 0, name: 'Land' };
export const POINT_TO_POINT: RaceType = { id: 1, name: 'Point To Point' };
export const SEA: RaceType = { id: 3, name: 'Sea' };
export const AIR: RaceType = { id: 5, name: 'Air' };
export const STUNT: RaceType = { id: 6, name: 'Stunt' };
export const PARACHUTE: RaceType = { id: 8, name: 'Parachute' };
export const BIKE: RaceType = { id: 13, name: 'Bike' };

export const RACE_TYPES: RaceType[] = [
  LAND,
  POINT_TO_POINT,
  SEA,
  AIR,
  STUNT,
  PARACHUTE,
  BIKE
];

const SUPPORTED_RACE_TYPES: RaceType[] = [
  LAND,
  STUNT
];

function byId(id: number) {
  return RACE_TYPES.find(rt => rt.id === id);
}

function isSupported(raceType: RaceType) {
  return SUPPORTED_RACE_TYPES.some(rt => rt.id === raceType.id);
}

const raceType = {
  byId,
  isSupported
};

export default raceType;

