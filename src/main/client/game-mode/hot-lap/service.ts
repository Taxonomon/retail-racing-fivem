import gameModeState from "../state";
import {
  getPreLoadedJobObjectsFromAvailableJob, JobObjects, placeJobCheckpoint, removeJobCheckpoint,
  startUpdatingNearbyJobPropsAndFixtures,
  stopUpdatingNearbyJobPropsAndFixtures,
  tearDownPlacedJob
} from "../../rockstar/job/service";
import {switchGameModeTo} from "../service";
import {setClientCoordinates, setClientHeading} from "../../player/service";
import rockstarJobState from "../../rockstar/job/state";
import logger from "../../logging/logger";
import {AvailableJob} from "../../../common/rockstar/job/available-job";
import hotLapState from "./state";
import {Checkpoint} from "../../../common/rockstar/job/checkpoint";
import {waitOneFrame} from "../../../common/wait";
import {distanceBetweenVector3s, Vector3} from "../../../common/vector";
import playerState from "../../player/state";

const FREEZE_CLIENT_ON_SPAWN_POINT_FOR_MS = 1000;

export async function startHotLap(jobHash: string) {
  if ('RACE' === gameModeState.gameMode) {
    throw new Error('Cannot start hot lap while in a race');
  } else if ('HOT_LAP' === gameModeState.gameMode) {
    tearDownCurrentHotLap();
  }

  const job: AvailableJob | undefined = rockstarJobState.availableJobs.find(job => job.hash === jobHash);

  if (undefined === job) {
    throw new Error(`Could not find R* job for hash ${jobHash}`);
  }

  rockstarJobState.loadedJob = { ...job, ...await getPreLoadedJobObjectsFromAvailableJob(job) };

  const spawnCheckpoint = getHotLapSpawnCheckPoint();
  hotLapState.currentCheckpoint = spawnCheckpoint.index;

  startUpdatingNearbyJobPropsAndFixtures();
  startUpdatingHotLapCheckpoints();

  await teleportClientToHotLapSpawnPoint(
    spawnCheckpoint.checkpoint.coordinates,
    spawnCheckpoint.checkpoint.heading
  );

  switchGameModeTo('HOT_LAP');
}

async function teleportClientToHotLapSpawnPoint(coordinates: Vector3, heading: number) {
  // The client's hot lap spawn point may be on top of a prop.
  // In that case: freeze the client's position for a guesstimated amount of time
  // until the prop below them is placed.
  FreezeEntityPosition(PlayerId(), true);
  setClientCoordinates(coordinates);
  setClientHeading(heading);

  const teleportFinishedAt = GetGameTimer();
  while (GetGameTimer() - teleportFinishedAt < FREEZE_CLIENT_ON_SPAWN_POINT_FOR_MS) {
    await waitOneFrame();
  }

  FreezeEntityPosition(PlayerId(), false);
  logger.debug(`Teleported client to hot lap spawn point`);
}

function getHotLapSpawnCheckPoint(): { checkpoint: Checkpoint; index: number } {
  const checkpoints: Checkpoint[] = rockstarJobState.loadedJob.checkpoints;
  let index: number | undefined;

  switch (checkpoints.length) {
    case 0: {
      throw new Error('loaded job has no checkpoints');
    }
    case 1: {
      throw new Error('loaded job only has a single checkpoint');
    }
    case 2: {
      index = 0;
      break;
    }
    case 3: {
      index = -1;
      break;
    }
    case 4: {
      index = -2;
      break;
    }
    default: {
      index = -3;
      break;
    }
  }

  const checkpoint: Checkpoint | undefined = checkpoints.at(index);

  if (undefined === checkpoint) {
    throw new Error('no viable spawn check point found');
  }

  return { checkpoint, index };
}

function tearDownCurrentHotLap() {
  stopUpdatingNearbyJobPropsAndFixtures();
  tearDownPlacedJob();
}

function startUpdatingHotLapCheckpoints() {
  hotLapState.updateCheckpoints.start(() => {
    const { checkpoints } = rockstarJobState.loadedJob;

    const targetIndex = hotLapState.currentCheckpoint;
    const followUpIndex = targetIndex === checkpoints.length - 1 ? 0 : targetIndex + 1;

    const target = checkpoints.at(targetIndex);
    const followUp = checkpoints.at(followUpIndex);

    if (undefined === target) {
      logger.trace(`target checkpoint undefined`);
      return;
    } else if (undefined === followUp) {
      logger.trace(`follow up checkpoint undefined`);
      return;
    }

    if (undefined === target.ref) {
      placeJobCheckpoint(target, followUp.coordinates);
    }

    const distanceToTarget = distanceBetweenVector3s(playerState.coords, target.coordinates);

    if (distanceToTarget <= target.size) {
      logger.trace(`Client is touching target checkpoint (distance: ${distanceToTarget}, target.size: ${target.size})`);
      hotLapState.currentCheckpoint = followUpIndex;
      removeJobCheckpoint(target);
    } else {
      logger.trace(`Client isn't touching target checkpoint (distance: ${distanceToTarget}, target.size: ${target.size})`);
    }
  }, 100);
}

async function stopUpdatingHotLapCheckpoints() {
  hotLapState.updateCheckpoints.stop();
}

function placeInitialCheckpoints(targetCheckpoint: Checkpoint) {
  const { checkpoints } = rockstarJobState.loadedJob;
  const targetIndex = checkpoints.findIndex(checkpoint => checkpoint.coordinates === targetCheckpoint.coordinates);
  const followUpIndex = targetIndex === checkpoints.length - 1 ? 0 : targetIndex + 1;
  const followUpCheckpoint = checkpoints[followUpIndex];
}
