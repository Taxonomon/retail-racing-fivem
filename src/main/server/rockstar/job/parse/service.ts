import {getRaceTypeById, RaceType} from "../../../../common/rockstar/race-type";
import {getJobTypeById, JobType} from "../../../../common/rockstar/job-type";
import {RaceDistance} from "../../../../common/rockstar/race-distance";
import {METER} from "../../../../common/unit/unit";
import {JOB_AREAS, JobArea} from "../../../../common/rockstar/job-area";

export function parseJobName(json: any): string | undefined {
  return json?.mission?.gen?.nm?.toString();
}

export function parseJobAuthor(json: any): string | undefined {
  return json?.mission?.gen?.ownerId?.toString();
}

export function parseJobDescription(json: any): string | undefined {
  const description: string[] = json?.mission?.gen?.dec;
  return undefined === description ? undefined : description.join('');
}

export function parseJobType(json: any): JobType | undefined {
  return getJobTypeById(json?.mission?.gen?.type);
}

export function parseJobAreas(json: any): JobArea[] {
  const result: JobArea[] = [];
  const values: string[] = json?.meta?.loc;

  values.forEach(value => {
    const jobArea = JOB_AREAS.find((ja) => value === ja.id);
    if (undefined !== jobArea) {
      result.push(jobArea);
    }
  });

  return result;
}

export function parseRaceType(json: any): RaceType | undefined {
  return getRaceTypeById(json?.mission?.race?.type);
}

export function parseIsLapRace(json: any): boolean {
  return undefined !== json?.mission?.race?.lap;
}

export function parseRaceDistance(json: any): RaceDistance | undefined {
  const value = json?.mission?.race?.rdis;
  return undefined === value ? undefined : { value, unit: METER };
}
