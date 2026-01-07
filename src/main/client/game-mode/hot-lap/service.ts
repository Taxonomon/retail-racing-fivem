import gameModeState from "../state";
import {
  getPreLoadedJobObjectsFromAvailableJob, JobObjects,
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
  startUpdatingNearbyJobPropsAndFixtures();
  await teleportClientToHotLapSpawnPoint();
  switchGameModeTo('HOT_LAP');
}

async function teleportClientToHotLapSpawnPoint() {
  const spawnCheckPoint: Checkpoint = getHotLapSpawnCheckPoint();

  // The client's hot lap spawn point may be on top of a prop.
  // In that case: freeze the client's position for a guesstimated amount of time
  // until the prop below them is placed.
  FreezeEntityPosition(PlayerId(), true);
  setClientCoordinates(spawnCheckPoint.coordinates);
  setClientHeading(spawnCheckPoint.heading);

  const teleportFinishedAt = GetGameTimer();
  while (GetGameTimer() - teleportFinishedAt < FREEZE_CLIENT_ON_SPAWN_POINT_FOR_MS) {
    await waitOneFrame();
  }

  FreezeEntityPosition(PlayerId(), false);
  logger.debug(`Teleported client to hot lap spawn point`);
}

function getHotLapSpawnCheckPoint() {
  const checkpoints: Checkpoint[] = rockstarJobState.loadedJob.checkpoints;
  let result: Checkpoint | undefined;

  switch (checkpoints.length) {
    case 0: {
      throw new Error('loaded job has no checkpoints');
    }
    case 1: {
      throw new Error('loaded job only has a single checkpoint');
    }
    case 2: {
      result = checkpoints.at(0);
      break;
    }
    case 3: {
      result = checkpoints.at(-1);
      break;
    }
    case 4: {
      result = checkpoints.at(-2);
      break;
    }
    default: {
      result = checkpoints.at(-3);
      break;
    }
  }

  if (undefined === result) {
    throw new Error('no viable spawn check point found');
  }

  return result;
}

function tearDownCurrentHotLap() {
  stopUpdatingNearbyJobPropsAndFixtures();
  tearDownPlacedJob();
}
