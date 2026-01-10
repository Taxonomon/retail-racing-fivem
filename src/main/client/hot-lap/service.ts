import {Checkpoint, TrackFromServer} from "../../common/track/schemas";
import {playerState} from "../player/state";
import logger from "../logging/logger";
import {Vector3} from "../../common/vector";
import {FREEZE_CLIENT_ON_TELEPORT_FOR_MS} from "./constants";
import {getCurrentVehicleRef} from "../vehicle/service";
import {setClientCoordinates} from "../player/service";
import {waitOneFrame} from "../../common/wait";
import {switchGameModeTo} from "../player/game-mode";
import {start as startRenderingTrack, stop as stopRenderingTrack, toParsedTrack} from "../track/service/render/track";
import {OnTrackCheckpointPassedEventProps, ParsedTrack} from "../track/schemas";
import {hotLapState} from "./state";
import {hideLapTimer, updateLapTimer} from "../gui/lap-timer/service";
import {trackState} from "../track/state";
import {clearAll as clearAllRenderedCheckpoints} from "../track/service/render/checkpoints";

export async function setUpHotLap(track: TrackFromServer) {
  if ('RACE' === playerState.gameMode) {
    throw new Error('Cannot start a hot lap while in a race');
  } else if ('HOT_LAP' === playerState.gameMode) {
    stopRenderingTrack();
  } else {
    switchGameModeTo('HOT_LAP');
  }

  hotLapState.lapStartedAt = Number.NaN;

  if (!hotLapState.updateGui.isRunning()) {
    hotLapState.updateGui.start(updateGui);
  }

  try {
    const parsedTrack: ParsedTrack = toParsedTrack(track);
    const { checkpoint, index } = getSpawnCheckpoint(parsedTrack.checkpoints);

    startRenderingTrack({
      track: parsedTrack,
      renderStrategy: {
        props: 'NEARBY',
        fixtureRemovals: 'NEARBY',
        checkpoints: 'NEXT'
      },
      spawnPoint: checkpoint.coordinates,
      initialCheckpointIndex: index,
      withSound: true
    });

    await teleportClientToCheckpoint(checkpoint);
  } catch (error: any) {
    stopRenderingTrack();
    switchGameModeTo('FREE_MODE');
    throw error;
  }
}

function getSpawnCheckpoint(checkpoints: Checkpoint[]): { checkpoint: Checkpoint, index: number } {
  let checkpoint: Checkpoint | undefined;
  let index: number | undefined;

  switch (checkpoints.length) {
    case 0:
      throw new Error('Track has no checkpoints');
    case 1:
      throw new Error('Track only has a single checkpoint');
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
    case 5: {
      index = -3;
      break;
    }
    default: {
      index = -4;
      break;
    }
  }

  checkpoint = checkpoints.at(index);

  if (undefined === checkpoint) {
    throw new Error('Spawn checkpoint undefined');
  }

  return { checkpoint, index };
}

async function teleportClientToCheckpoint(checkpoint: Checkpoint) {
  let ref = getCurrentVehicleRef();

  if (0 === ref) {
    ref = PlayerPedId();
  }

  FreezeEntityPosition(ref, true);

  SetEntityCoords(
    ref,
    checkpoint.coordinates.x,
    checkpoint.coordinates.y,
    checkpoint.coordinates.z,
    false,
    false,
    false,
    false,
  );
  SetEntityHeading(ref, checkpoint.heading);
  const teleportedAt = GetGameTimer();

  while (GetGameTimer() - teleportedAt < FREEZE_CLIENT_ON_TELEPORT_FOR_MS) {
    await waitOneFrame();
  }

  FreezeEntityPosition(ref, false);
  logger.debug(`Teleported client to hot lap spawn point at ${JSON.stringify(checkpoint.coordinates)}`);
}

export function handleOnTrackCheckpointPassedEvent(data: OnTrackCheckpointPassedEventProps) {
  const { lap, checkpointIndex, passedAt } = data;

  if (0 === checkpointIndex) {
    hotLapState.lapStartedAt = GetGameTimer();
  }
}

function updateGui() {
  updateLapTimer(Number.isNaN(hotLapState.lapStartedAt) ? 0 : GetGameTimer() - hotLapState.lapStartedAt);
}

export async function resetHotLap() {
  const track = trackState.currentTrack;

  if (undefined === track) {
    throw new Error('No track is currently loaded');
  }

  const { checkpoint, index } = getSpawnCheckpoint(track.checkpoints);
  trackState.currentCheckpointIndex = index;
  trackState.currentLap = 0;
  hotLapState.lapStartedAt = Number.NaN;
  clearAllRenderedCheckpoints();
  await teleportClientToCheckpoint(checkpoint);
}

export async function respawn() {
  const checkpoint = trackState.currentTrack?.checkpoints[trackState.currentCheckpointIndex];

  if (undefined === checkpoint) {
    throw new Error('No checkpoint found to teleport to');
  }

  await teleportClientToCheckpoint(checkpoint);
}

export function stopHotLap() {
  if ('HOT_LAP' !== playerState.gameMode) {
    throw new Error('Not in hot lap');
  }

  if (hotLapState.updateGui.isRunning()) {
    hotLapState.updateGui.stop();
  }

  stopRenderingTrack();
  hideLapTimer();
  switchGameModeTo('FREE_MODE');
}
