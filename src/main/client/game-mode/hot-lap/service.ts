import gameModeState from "../state";
import {
  drawBlip,
  getPreLoadedJobObjectsFromAvailableJob,
  placeJobCheckpoint, removeBlip,
  removeJobCheckpoint,
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
import playSound from "../../sound";
import {updateLapTimer} from "../../gui/lap-timer/service";
import {getCurrentVehicleRef} from "../../vehicle/service";

const FREEZE_CLIENT_ON_SPAWN_POINT_FOR_MS = 500;

const DRAW_BLIP_PROPS = {
  TARGET: {
    SCALE: 1.3,
    ALPHA: 255
  },
  FOLLOW_UP: {
    SCALE: 0.65,
    ALPHA: 130
  }
};

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

  if ('HOT_LAP' !== gameModeState.gameMode) {
    switchGameModeTo('HOT_LAP');
  }

  rockstarJobState.loadedJob = { ...job, ...await getPreLoadedJobObjectsFromAvailableJob(job) };

  const spawnCheckpoint = getHotLapSpawnCheckPoint();
  hotLapState.currentCheckpoint = spawnCheckpoint.index;
  startUpdatingNearbyJobPropsAndFixtures();
  startUpdatingHotLapCheckpoints();

  // check if setImmediate is even needed here
  // also, this sometimes still puts the client below the track if spawned on props (e.g. BGNZ Granite)
  await teleportClientToHotLapSpawnPoint(
    spawnCheckpoint.checkpoint.coordinates,
    spawnCheckpoint.checkpoint.heading
  );
}

async function teleportClientToHotLapSpawnPoint(coordinates: Vector3, heading: number) {
  let entityToFreeze: number = getCurrentVehicleRef();
  let offset: Vector3 = { x: 0, y: 0, z: 0 };

  if (0 === entityToFreeze) {
    entityToFreeze = PlayerPedId();
  }
  // The client's hot lap spawn point may be on top of a prop.
  // In that case: freeze the client's position for a guesstimated amount of time
  // until the prop below them is placed.
  FreezeEntityPosition(entityToFreeze, true);
  setClientCoordinates({
    x: coordinates.x - (offset?.x ?? 0),
    y: coordinates.y - (offset?.y ?? 0),
    z: coordinates.z - (offset?.z ?? 0)
  });
  setClientHeading(heading);

  const teleportFinishedAt = GetGameTimer();

  while (GetGameTimer() - teleportFinishedAt < FREEZE_CLIENT_ON_SPAWN_POINT_FOR_MS) {
    await waitOneFrame();
    logger.debug(`Waiting to unfreeze client...`);
  }

  FreezeEntityPosition(entityToFreeze, false);
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
    if (0 !== hotLapState.lap && -1 !== hotLapState.lapStartedAt) {
      updateLapTimer(GetGameTimer() - hotLapState.lapStartedAt);
    }

    const { checkpoints } = rockstarJobState.loadedJob;

    const currentIndex = hotLapState.currentCheckpoint;
    const targetIndex = currentIndex === checkpoints.length - 1 ? 0 : currentIndex + 1;
    const followUpIndex = targetIndex === checkpoints.length - 1 ? 0 : targetIndex + 1;

    // logger.trace(
    //   `(update checkpoints) `
    //   + `current: ${currentIndex} | `
    //   + `target: ${targetIndex} | `
    //   + `followUp: ${followUpIndex} | `
    //   + `total: ${checkpoints.length}`
    // );

    const target = checkpoints.at(targetIndex);
    const followUp = checkpoints.at(followUpIndex);

    if (undefined === target || undefined === followUp) {
      return;
    }

    if (undefined === target.ref) {
      placeJobCheckpoint(target, followUp.coordinates);

      target.blipRef = drawBlip({
        coordinates: target.coordinates,
        scale: DRAW_BLIP_PROPS.TARGET.SCALE,
        alpha: DRAW_BLIP_PROPS.TARGET.ALPHA
      });

      followUp.blipRef = drawBlip({
        coordinates: followUp.coordinates,
        scale: DRAW_BLIP_PROPS.FOLLOW_UP.SCALE,
        alpha: DRAW_BLIP_PROPS.FOLLOW_UP.ALPHA
      });
    }

    const distanceToTarget = distanceBetweenVector3s(playerState.coords, target.coordinates);

    if (distanceToTarget <= target.size) {
      hotLapState.currentCheckpoint = targetIndex;
      removeJobCheckpoint(target);
      removeBlip(target.blipRef ?? 0);
      removeBlip(followUp.blipRef ?? 0);


      if (0 === targetIndex) {
        hotLapState.lap++;
        hotLapState.lapStartedAt = GetGameTimer();
        playSound.lapCompleted();
      } else {
        playSound.checkpointHit();
      }
    }
  });
}

function stopUpdatingHotLapCheckpoints() {
  hotLapState.updateCheckpoints.stop();
}

export async function resetHotLap() {
  stopUpdatingHotLapCheckpoints();
  tearDownPlacedJob();
  hotLapState.lap = 0;
  hotLapState.lapStartedAt = -1000;
  const spawnCheckpoint = getHotLapSpawnCheckPoint();
  hotLapState.currentCheckpoint = spawnCheckpoint.index;
  startUpdatingNearbyJobPropsAndFixtures();
  startUpdatingHotLapCheckpoints();

  // check if setImmediate is even needed here
  // also, this sometimes still puts the client below the track if spawned on props (e.g. BGNZ Granite)
  await teleportClientToHotLapSpawnPoint(
    spawnCheckpoint.checkpoint.coordinates,
    spawnCheckpoint.checkpoint.heading
  );

  logger.info(`Reset current hot lap`);
}
