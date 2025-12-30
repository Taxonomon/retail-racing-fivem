import {RaceDistance} from "../../../common/rockstar-job/race/race-distance";
import {METER} from "../../../common/unit/unit";
import type {RaceType} from "../../../common/rockstar-job/race/race-type";
import rockstarRaceType from "../../../common/rockstar-job/race/race-type";

function raceType(json: any): RaceType | undefined {
  return rockstarRaceType.byId(json?.mission?.race?.type);
}

function isLapRace(json: any): boolean {
  return undefined !== json?.mission?.race?.lap;
}

function distance(json: any): RaceDistance {
  return {
    unit: METER,
    value: json?.mission?.race?.rdis
  };
}

const raceParser = {
  raceType,
  isLapRace,
  distance
};

export default raceParser;
