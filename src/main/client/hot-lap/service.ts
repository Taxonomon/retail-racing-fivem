import {Checkpoint, TrackFromServer} from "../../common/track/schemas";
import {playerState} from "../player/state";
import {hotLapState} from "./state";
import {getTrackProps} from "../track/service/objects/prop";
import {getTrackFixtureRemovals} from "../track/service/objects/fixture-removal";
import {getTrackCheckpoints} from "../track/service/objects/checkpoint";
import {ActiveHotLapTrack} from "./schemas";
import logger from "../logging/logger";
import {distanceBetweenVector3s, Vector3} from "../../common/vector";
import {FREEZE_CLIENT_ON_TELEPORT_FOR_MS} from "./constants";
import {getCurrentVehicleRef} from "../vehicle/service";
import {setClientCoordinates} from "../player/service";
import {waitOneFrame} from "../../common/wait";
import {switchGameModeTo} from "../player/game-mode";
import {start as startRenderingTrack, stop as stopRenderingTrack, toParsedTrack} from "../track/service/render/track";
import {ParsedTrack} from "../track/schemas";

export async function setUpHotLap(track: TrackFromServer) {
  if ('RACE' === playerState.gameMode) {
    throw new Error('Cannot start a hot lap while in a race');
  } else if ('HOT_LAP' === playerState.gameMode) {
    stopRenderingTrack();
  } else {
    switchGameModeTo('HOT_LAP');
  }

  try {
    const parsedTrack: ParsedTrack = toParsedTrack(track);
    const { spawnPoint, spawnCheckpointIndex } = getSpawnPoint(parsedTrack.checkpoints);

    startRenderingTrack({
      track: parsedTrack,
      renderStrategy: {
        props: 'NEARBY',
        fixtureRemovals: 'NEARBY',
        checkpoints: 'NEXT'
      },
      spawnPoint,
      initialCheckpointIndex: spawnCheckpointIndex,
      withSound: true
    });

    await teleportClientToSpawnPoint(spawnPoint);
  } catch (error: any) {
    stopRenderingTrack();
    switchGameModeTo('FREE_MODE');
    throw error;
  }
}

function getSpawnPoint(checkpoints: Checkpoint[]): { spawnPoint: Vector3, spawnCheckpointIndex: number } {
  let coordinates: Vector3 | undefined;
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

  coordinates = checkpoints.at(index)?.coordinates;

  if (undefined === coordinates) {
    throw new Error('Spawn point undefined');
  }

  return { spawnPoint: coordinates, spawnCheckpointIndex: index };
}

async function teleportClientToSpawnPoint(coordinates: Vector3) {
  let ref = getCurrentVehicleRef();

  if (0 === ref) {
    ref = PlayerPedId();
  }

  FreezeEntityPosition(ref, true);

  setClientCoordinates(coordinates);
  const teleportedAt = GetGameTimer();

  while (GetGameTimer() - teleportedAt < FREEZE_CLIENT_ON_TELEPORT_FOR_MS) {
    await waitOneFrame();
  }

  FreezeEntityPosition(ref, false);
  logger.debug(`Teleported client to hot lap spawn point at ${JSON.stringify(coordinates)}`);
}
