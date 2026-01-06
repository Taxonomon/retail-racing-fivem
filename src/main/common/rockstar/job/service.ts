import {getJobTypeById, JobType} from "./job-type";
import {JOB_AREAS, JobArea} from "./job-area";
import {getRaceTypeById, RaceType} from "./race-type";
import {RaceDistance} from "./race-distance";
import {METER} from "../../unit/unit";
import {Prop} from "./prop";
import {FixtureRemoval} from "./fixture-removal";
import {Checkpoint} from "./checkpoint";
import {CHECKPOINT_EFFECTS, CheckpointEffect} from "./checkpoint-effect";
import logger from "../../../gui/logging/logger";

const DEFAULT_FIXTURE_REMOVAL_RADIUS = 3;
const MINIMUM_CHECKPOINT_SIZE = 50;

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
  const count: number = json?.mission?.prop?.no ?? 0;

  if (undefined === json?.mission?.prop) {
    return result;
  }

  for (let i = 0; i < count; i++) {
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
      logger.warn(`Failed to parse static prop ${i}: ${error.message}`);
    }
  }

  return result;
}

function parseDynamicProps(json: any, propProps: PropProps): Prop[] {
  const result: Prop[] = [];
  const count: number = json?.mission?.dprop?.no ?? 0;

  if (undefined === json?.mission?.dprop) {
    return result;
  }

  for (let i = 0; i < count; i++) {
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
      logger.warn(`Failed to parse dynamic prop ${i}: ${error.message}`);
    }
  }

  return result;
}

export function parseJobFixtureRemovals(json: any): FixtureRemoval[] {
  const result: FixtureRemoval[] = [];
  const count: number = json?.mission?.dhprop?.no ?? 0;

  if (undefined === json?.mission?.dhprop) {
    return result;
  }

  for (let i = 0; i < count; i++) {
    try {
      result.push({
        enabled: false,
        hash: json.mission.dhprop.mn[i],
        coordinates: {
          x: json.mission.dhprop.pos[i].x,
          y: json.mission.dhprop.pos[i].y,
          z: json.mission.dhprop.pos[i].z
        },
        radius: json?.mission?.dhprop?.wprad[i] ?? DEFAULT_FIXTURE_REMOVAL_RADIUS
      });
    } catch (error: any) {
      logger.warn(`Failed to parse fixture removal ${i}: ${error.message}`);
    }
  }

  return result;
}

export function parseJobCheckpoints(json: any) {
  const result: Checkpoint[] = [];
  const count = json?.mission?.race?.chp?.length ?? 0;

  for (let i = 0; i < count; i++) {
    try {
      result.push({
        coordinates: {
          x: json.mission.race.chl[i].x,
          y: json.mission.race.chl[i].y,
          z: json.mission.race.chl[i].z
        },
        heading: json.mission.race.chh[i],
        size: Math.max(json?.mission?.race?.chs ?? 0, MINIMUM_CHECKPOINT_SIZE),
        effects: parseJobCheckpointEffects(json, i),
        secondaryCheckpoint: parseJobSecondaryCheckpoint(json, i)
      });
    } catch (error: any) {
      logger.warn(`Failed to parse checkpoint ${i}: ${error.message}`);
    }
  }

  // In an R* race, the start/finish checkpoint gets placed at the end of the checkpoints array.
  // For convenience, if possible, we'll pull it in front to the first index, and append the remaining
  // checkpoints after it.
  try {
    return [
      result.at(-1)!,
      ...result.slice(0, -2)
    ];
  } catch (error: any) {
    return result;
  }
}

export function parseJobSecondaryCheckpoint(json: any, index: number) {
  try {
    return {
      coordinates: {
        x: json.mission.race.sndchk[index].x,
          y: json.mission.race.sndchk[index].y,
          z: json.mission.race.sndchk[index].z,
      },
      heading: json.mission.race.sndrsp[index],
        size: Math.max(json?.mission?.race?.chs2 ?? 0, MINIMUM_CHECKPOINT_SIZE)
    }
  } catch (error: any) {
    return undefined;
  }
}

function parseJobCheckpointEffects(json: any, index: number) {
  const result: CheckpointEffect[] = [];
  const cpbs1Value: number = json?.mission?.cpbs1[index] ?? -1;
  const cpbs2Value: number = json?.mission?.cpbs2[index] ?? -1;

  CHECKPOINT_EFFECTS.forEach(effect => {
    if (
      (1 === effect.nativeCpbsType && isBitSet(cpbs1Value, effect.index))
      || (2 === effect.nativeCpbsType && isBitSet(cpbs2Value, effect.index))
    ) {
      result.push(effect);
    }
  });

  return result;
}

function isBitSet(x: number, n: number): boolean {
  return (x & (1 << n)) !== 0;
}
