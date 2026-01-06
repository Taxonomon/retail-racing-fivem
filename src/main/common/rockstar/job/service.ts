import {getJobTypeById, JobType} from "./job-type";
import {JOB_AREAS, JobArea} from "./job-area";
import {getRaceTypeById, RaceType} from "./race-type";
import {RaceDistance} from "./race-distance";
import {METER} from "../../unit/unit";
import {Prop} from "./prop";
import {FixtureRemoval} from "./fixture-removal";

const DEFAULT_FIXTURE_REMOVAL_RADIUS = 3;

type PropProps = {
  hasLODDistances: boolean;
  hasCollisions: boolean;
};

export function parseJobName(json: any): string | undefined {
  return json?.mission?.gen?.nm?.toString();
}

export function parseJobAuthor(json: any): string | undefined {
  return json?.mission?.gen?.ownerid?.toString();
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

export function parseJobProps(json: any): Prop[] {
  const propProps: PropProps = {
    hasLODDistances: undefined !== json?.mission?.prop?.pLODDist,
    hasCollisions: undefined !== json?.mission?.prop?.collision
  };
  return [
    ...parseJobStaticProps(json, propProps),
    ...parseDynamicProps(json, propProps),
  ];
}

function parseJobStaticProps(json: any, propProps: PropProps): Prop[] {
  const result: Prop[] = [];
  const propCount: number = json?.mission?.prop?.no ?? 0;

  if (undefined === json?.mission?.prop || 0 === propCount) {
    return result;
  }

  for (let i = 0; i < propCount; i++) {
    try {
      result.push({
        hash: json.mission.prop.model[i],
        isDynamic: false,
        coordinates: {
          x: json?.mission.prop.loc[i].x,
          y: json?.mission.prop.loc[i].y,
          z: json?.mission.prop.loc[i].z
        },
        rotation: {
          x: json?.mission.prop.vRot[i].x,
          y: json?.mission.prop.vRot[i].y,
          z: json?.mission.prop.vRot[i].z
        },
        hasCollision: propProps.hasCollisions && 1 === json?.mission?.prop?.collision[i],
        color: json?.mission?.prop?.prpclr[i] ?? 0
      });
    } catch (error: any) {
      // swallow & do nothing
    }
  }

  return result;
}

function parseDynamicProps(json: any, propProps: PropProps): Prop[] {
  const result: Prop[] = [];
  const propCount: number = json?.mission?.dprop?.no ?? 0;

  if (undefined === json?.mission?.dprop || 0 === propCount) {
    return result;
  }

  for (let i = 0; i < propCount; i++) {
    try {
      result.push({
        hash: json.mission.dprop.model[i],
        isDynamic: false,
        coordinates: {
          x: json?.mission.dprop.loc[i].x,
          y: json?.mission.dprop.loc[i].y,
          z: json?.mission.dprop.loc[i].z
        },
        rotation: {
          x: json?.mission.dprop.vRot[i].x,
          y: json?.mission.dprop.vRot[i].y,
          z: json?.mission.dprop.vRot[i].z
        },
        hasCollision: propProps.hasCollisions && 1 === json?.mission?.dprop?.collision[i],
        color: json?.mission?.dprop?.prpdclr[i] ?? 0
      });
    } catch (error: any) {
      // swallow & do nothing
    }
  }

  return result;
}

export function parseFixtureRemovals(json: any): FixtureRemoval[] {
  const result: FixtureRemoval[] = [];

  const fixtureRemovalCount: number = json?.mission?.dhprop?.no ?? 0;

  if (undefined === json?.mission?.dhprop || 0 === fixtureRemovalCount) {
    return result;
  }

  for (let i = 0; i < fixtureRemovalCount; i++) {
    try {
      result.push({
        hash: json.mission.dhprop.mn[i],
        coordinates: {
          x: json.mission.dhprop.pos[i].x,
          y: json.mission.dhprop.pos[i].y,
          z: json.mission.dhprop.pos[i].z
        },
        radius: json?.mission?.dhprop?.wprad[i] ?? DEFAULT_FIXTURE_REMOVAL_RADIUS
      });
    } catch (error: any) {
      // swallow and do nothing
    }
  }

  return result;
}
