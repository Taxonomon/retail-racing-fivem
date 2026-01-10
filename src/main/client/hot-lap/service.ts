import {Checkpoint, CheckpointProps, TrackFromServer} from "../../common/track/schemas";
import { playerState } from "../player/state";
import { startUpdatingNearbyTrackObjects, stopUpdatingNearbyTrackObjects } from "../track/service/update-nearby";
import { hotLapState } from "./state";
import { getTrackProps, removeProp } from "../track/service/objects/prop";
import { getTrackFixtureRemovals, toggleFixtureRemoval } from "../track/service/objects/fixture-removal";
import { createCheckpoint, getTrackCheckpoints, removeCheckpoint } from "../track/service/objects/checkpoint";
import { createBlip, removeBlip } from "../track/service/objects/blip";
import {ActiveHotLapTrack} from "./schemas";
import logger from "../logging/logger";
import { distanceBetweenVector3s, Vector3 } from "../../common/vector";
import {
  BLIP,
  CHECKPOINT,
  DEFAULT_CHECKPOINT_HEIGHT,
  FREEZE_CLIENT_ON_TELEPORT_FOR_MS
} from "./constants";
import { updateLapTimer } from "../gui/lap-timer/service";
import { BLIP_COLOR, BLIP_SPRITE } from "../../common/track/constants";
import { getCurrentVehicleRef } from "../vehicle/service";
import { setClientCoordinates } from "../player/service";
import { waitOneFrame } from "../../common/wait";
import playSound from "../sound";
import {switchGameModeTo} from "../player/game-mode";

export async function setUpHotLap(track: TrackFromServer) {
	if ('RACE' === playerState.gameMode) {
		throw new Error('Cannot start a hot lap while in a race');
	}

	if ('HOT_LAP' === playerState.gameMode) {
		tearDownHotLap();
	}

  switchGameModeTo('HOT_LAP');

	const hotLapTrack: ActiveHotLapTrack = await initializeHotLapTrack(track);
	const spawnCheckpointIndex = getSpawnCheckpointIndex(hotLapTrack);

	hotLapState.track = hotLapTrack;
	hotLapState.spawnCheckpointIndex = spawnCheckpointIndex;
	hotLapState.checkpoint = spawnCheckpointIndex;
	markObjectsAroundSpawnAsPersistent(hotLapTrack, spawnCheckpointIndex);

	try {
		startUpdatingCheckpoints(hotLapTrack.checkpoints);
		startUpdatingNearbyTrackObjects(
			hotLapTrack.props,
			hotLapTrack.fixtureRemovals,
		);
		await teleportClientToSpawnPoint(hotLapState.track.checkpoints.at(spawnCheckpointIndex)!.coordinates);
	} catch (error: any) {
		tearDownHotLap();
		throw new Error('Failed to start updating track objects', { cause: error });
	}
}

async function initializeHotLapTrack(track: TrackFromServer) {
	try {
		return await toActiveHotLapTrack(track);
	} catch (error: any) {
		throw new Error('Failed to initialize hot lap track', { cause: error });
	}
}

async function toActiveHotLapTrack(track: TrackFromServer) {
	return {
		...track,
		props: await getTrackProps(track.hash, { preload: true }),
		fixtureRemovals: getTrackFixtureRemovals(track.hash),
		checkpoints: getTrackCheckpoints(track.hash)
	};
}

function getSpawnCheckpointIndex(track: ActiveHotLapTrack): number {
	switch (track.checkpoints.length) {
		case 0: throw new Error('Track has no checkpoints');
		case 1: throw new Error('Track only has a single checkpoint');
		case 2: return 0;
		case 3: return -1;
		case 4: return -2;
		case 5: return -3;
		default: return -4;
	}
}

function markObjectsAroundSpawnAsPersistent(
	track: ActiveHotLapTrack,
	spawnCheckpointIndex: number
) {
	// This shouldn't be undefined as the spawnCheckpointIndex is based on the
	// number of checkpoints taken from this track.
	const spawnCheckpoint = track.checkpoints.at(spawnCheckpointIndex)!;

	const withinSpawnRadius = (coordinates: Vector3): boolean =>
		distanceBetweenVector3s(spawnCheckpoint.coordinates, coordinates) <= spawnCheckpoint.size;

	track.props.forEach(p => p.persistWhileOutOfRange = withinSpawnRadius(p.coordinates));
	track.fixtureRemovals.forEach(f => f.persistWhileOutOfRange = withinSpawnRadius(f.coordinates));
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

function startUpdatingCheckpoints(checkpoints: Checkpoint[]) {
	hotLapState.updateCheckpoints.start(() => updateCheckpoints(checkpoints));
}

function stopUpdatingCheckpoints() {
	hotLapState.updateCheckpoints.stop();
}

function updateCheckpoints(checkpoints: Checkpoint[]) {
	updateLapTimer(0 === hotLapState.lap ? 0 : GetGameTimer() - hotLapState.lapStartedAt);

	const currentIndex = hotLapState.checkpoint!;

	const targetIndex = currentIndex === checkpoints.length - 1 ? 0 : currentIndex + 1;
	const target = checkpoints.at(targetIndex);

	const followUpIndex = targetIndex === checkpoints.length - 1 ? 0 : targetIndex + 1;
	const followUp = checkpoints.at(followUpIndex);

	if (undefined === target || undefined === followUp) {
		return;
	}

  // place target checkpoints + blips

  target.ref ??= placeTargetCheckpoint(target, followUp.coordinates);
  target.blipRef ??= placeTargetBlip(target.coordinates, targetIndex);

  if (undefined !== target.secondaryCheckpoint) {
    target.secondaryCheckpoint.ref ??= placeTargetSecondaryCheckpoint(
      target.secondaryCheckpoint,
      followUp.coordinates
    );
    target.secondaryCheckpoint.blipRef ??= placeTargetBlip(
      target.secondaryCheckpoint.coordinates,
      targetIndex
    );
  }

  // place follow-up checkpoints + blips

	followUp.blipRef ??= placeFollowUpBlip(followUp.coordinates, followUpIndex);

	if (undefined !== followUp.secondaryCheckpoint) {
		followUp.secondaryCheckpoint.blipRef ??= placeFollowUpBlip(
      followUp.secondaryCheckpoint.coordinates,
      followUpIndex
    );
	}

	const withinTargetCheckpointDistance = distanceBetweenVector3s(
		playerState.coordinates,
		target.coordinates
	) <= target.size;

  const withinTargetSecondaryCheckpointDistance = undefined !== target.secondaryCheckpoint
    && distanceBetweenVector3s(
      playerState.coordinates,
      target.secondaryCheckpoint.coordinates
    ) <= target.size;

	if (withinTargetCheckpointDistance || withinTargetSecondaryCheckpointDistance) {
		hotLapState.checkpoint = currentIndex === checkpoints.length - 1 ? 0 : currentIndex + 1;

		removeCheckpoint({ ...target });
		target.ref = undefined;

		removeBlip({ ref: target.blipRef, coordinates: target.coordinates });
		target.blipRef = undefined;

		if (undefined !== target.secondaryCheckpoint?.ref) {
			removeCheckpoint({ ...target.secondaryCheckpoint });
			target.secondaryCheckpoint.ref = undefined;

			if (undefined !== target.secondaryCheckpoint.blipRef) {
				removeBlip({
					ref: target.secondaryCheckpoint.blipRef,
					coordinates: target.secondaryCheckpoint.coordinates
				});
        target.secondaryCheckpoint.blipRef = undefined;
			}
		}

		removeBlip({ ref: followUp.blipRef, coordinates: followUp.coordinates });
		followUp.blipRef = undefined;

		if (undefined !== followUp.secondaryCheckpoint?.blipRef) {
			removeBlip({
				ref: followUp.secondaryCheckpoint.blipRef,
				coordinates: followUp.secondaryCheckpoint.coordinates
			});
      followUp.secondaryCheckpoint.blipRef = undefined;
		}

		if (0 === targetIndex) {
			playSound.lapCompleted();
			hotLapState.lap++;
			hotLapState.lapStartedAt = GetGameTimer();
		} else {
			playSound.checkpointHit();
		}
	}
}

function tearDownHotLap() {
	stopUpdatingNearbyTrackObjects();
	stopUpdatingCheckpoints();
	removeActiveTrackObjects();

	hotLapState.lap = 0;
	hotLapState.lapStartedAt = -1;
	hotLapState.track = undefined;

	logger.info(`Tore down current hot lap`);
}

function removeActiveTrackObjects() {
	const track: ActiveHotLapTrack | undefined = hotLapState.track;

	if (undefined === track) {
		return;
	}

	track.props.forEach(prop => {
		if (undefined !== prop.ref) {
			removeProp({
				...prop,
				ref: prop.ref
			});
			prop.ref = undefined;
		}
	});

	track.fixtureRemovals.forEach(fixtureRemoval => {
		if (fixtureRemoval.enabled) {
			toggleFixtureRemoval({
				...fixtureRemoval,
				enable: false
			});
			fixtureRemoval.enabled = false;
		}
	});

	track.checkpoints.forEach(checkpoint => {
		if (undefined !== checkpoint.ref) {
			removeCheckpoint(checkpoint);
      checkpoint.ref = undefined;
			if (undefined !== checkpoint.blipRef) {
				removeBlip({
					ref: checkpoint.blipRef,
					coordinates: checkpoint.coordinates
				});
        checkpoint.blipRef = undefined;
			}
		}
    if (undefined !== checkpoint.secondaryCheckpoint) {
      if (undefined !== checkpoint.secondaryCheckpoint.ref) {
        removeCheckpoint({ ...checkpoint.secondaryCheckpoint });
        checkpoint.secondaryCheckpoint.ref = undefined;
      }
      if (undefined !== checkpoint.secondaryCheckpoint.blipRef) {
        removeBlip({
          ref: checkpoint.secondaryCheckpoint.blipRef,
          coordinates: checkpoint.secondaryCheckpoint.coordinates
        });
        checkpoint.secondaryCheckpoint.blipRef = undefined;
      }
    }
	});
}

function placeTargetCheckpoint(checkpoint: Checkpoint, followUpCoordinates: Vector3) {
  return createCheckpoint({
    ...checkpoint,
    coordinates: {
      target: checkpoint.coordinates,
      followUp: followUpCoordinates
    },
    height: DEFAULT_CHECKPOINT_HEIGHT,
    offset: CHECKPOINT.OFFSET
  });
}

function placeTargetSecondaryCheckpoint(secondaryCheckpoint: CheckpointProps, followUpCoordinates: Vector3) {
  return createCheckpoint({
    ...secondaryCheckpoint,
    coordinates: {
      target: secondaryCheckpoint.coordinates,
      followUp: followUpCoordinates
    },
    height: DEFAULT_CHECKPOINT_HEIGHT,
    offset: CHECKPOINT.OFFSET
  });
}

function placeTargetBlip(coordinates: Vector3, index: number) {
  return createBlip({
    coordinates: coordinates,
    sprite: BLIP_SPRITE.RADAR_LEVEL,
    color: BLIP_COLOR.YELLOW,
    alpha: BLIP.TARGET.ALPHA,
    scale: BLIP.TARGET.SCALE,
    index
  });
}

function placeFollowUpBlip(coordinates: Vector3, index: number) {
  return createBlip({
    coordinates: coordinates,
    sprite: BLIP_SPRITE.RADAR_LEVEL,
    color: BLIP_COLOR.DARK_YELLOW,
    alpha: BLIP.FOLLOW_UP.ALPHA,
    scale: BLIP.FOLLOW_UP.SCALE,
    index
  });
}
