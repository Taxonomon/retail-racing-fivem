import {createCheckpoint, removeCheckpoint} from "../objects/checkpoint";
import {createBlip, removeBlip} from "../objects/blip";
import logger from "../../../logging/logger";
import {trackState} from "../../state";
import {BLIP, CHECKPOINT} from "../../constants";
import {Checkpoint, CheckpointProps} from "../../../../common/track/schemas";
import {BLIP_COLOR, BLIP_SPRITE} from "../../../../common/track/constants";
import {Vector3} from "../../../../common/schemas";
import {withinPlayerRadius} from "../../../player/coordinates";
import playSound from "../../../sound";
import EVENT_NAMES from "../../../../common/event-names";
import {OnTrackCheckpointPassedEventProps} from "../../schemas";

export function start(options?: { withSound?: boolean }) {
  const track = trackState.currentTrack;

  if (undefined === track) {
    throw new Error('No current track found to render checkpoints for');
  }

  stop();

  switch (trackState.renderStrategy.checkpoints) {
    case 'ALL': {
      renderAll({ withBlips: true });
      break;
    }
    case 'NEXT': {
      trackState.renderNextCheckpoints.start(() => renderNext(options));
      break;
    }
    case 'NONE': {
      // do nothing
      break;
    }
  }

  logger.debug(
    `Started rendering checkpoints of current track `
    + `using render strategy ${trackState.renderStrategy.checkpoints}`
  );
}

export function stop() {
  if (trackState.renderNextCheckpoints.isRunning()) {
    trackState.renderNextCheckpoints.stop();
  }
  clearAll();
  logger.debug(`Stopped rendering checkpoints of current track`);
}

function renderAll(options?: { withBlips?: boolean }) {
  const withBlips = options?.withBlips ?? false;

  (trackState.currentTrack?.checkpoints ?? []).forEach((
    curr: Checkpoint,
    i: number,
    all: Checkpoint[]
  ) => {
    curr.ref ??= renderCheckpoint(curr, (all[i + 1] ?? all[0]).coordinates);
    if (withBlips) {
      curr.blipRef ??= renderTargetBlip(curr.coordinates, i);
    }
  });

  logger.debug(
    `Rendered all checkpoints of current track `
    + `${withBlips ? '(including blips)' : ''}`
  );
}

function renderNext(options?: { withSound?: boolean }) {
  const checkpoints = trackState.currentTrack?.checkpoints;

  if (undefined === checkpoints || 0 === checkpoints.length) {
    return;
  }

  let currentIndex: number = trackState.currentCheckpointIndex;

  if (Number.isNaN(currentIndex)) {
    currentIndex = Number.isNaN(trackState.initialCheckpointIndex) ? 0 : trackState.initialCheckpointIndex;
  }

  const targetIndex = currentIndex === checkpoints.length - 1 ? 0 : currentIndex + 1;
  const target = checkpoints.at(targetIndex);

  const followUpIndex = targetIndex === checkpoints.length - 1 ? 0 : targetIndex + 1;
  const followUp = checkpoints.at(followUpIndex);

  if (undefined === target || undefined === followUp) {
    return;
  }

  renderTarget(target, followUp.coordinates, targetIndex);
  renderFollowUp(followUp, followUpIndex);

  const withinTargetRadius = withinPlayerRadius(target.coordinates, target.size);
  const withinTargetSecondaryRadius = undefined !== target.secondaryCheckpoint
   && withinPlayerRadius(target.secondaryCheckpoint.coordinates, target.secondaryCheckpoint.size);

  if (withinTargetRadius || withinTargetSecondaryRadius) {
    const now = GetGameTimer();
    const withSound = options?.withSound ?? false;

    clear(target);
    clear(followUp);

    trackState.currentCheckpointIndex = targetIndex;

    if (0 === targetIndex) {
      trackState.currentLap++;
      if (withSound) {
        playSound.lapCompleted();
      }
    } else if (withSound) {
      playSound.checkpointHit();
    }

    emit(
      EVENT_NAMES.TRACK.CHECKPOINT.PASSED, {
        lap: trackState.currentLap,
        checkpointIndex: targetIndex,
        passedAt: now
      } satisfies OnTrackCheckpointPassedEventProps
    );
  }
}

function renderTarget(checkpoint: Checkpoint, followUpCoordinates: Vector3, index: number) {
  checkpoint.ref ??= renderCheckpoint(checkpoint, followUpCoordinates);
  checkpoint.blipRef ??= renderTargetBlip(checkpoint.coordinates, index);

  const secondaryCheckpoint = checkpoint.secondaryCheckpoint;

  if (undefined !== secondaryCheckpoint) {
    secondaryCheckpoint.ref ??= renderCheckpoint(secondaryCheckpoint, followUpCoordinates);
    secondaryCheckpoint.blipRef ??= renderTargetBlip(secondaryCheckpoint.coordinates, index);
  }
}

function renderFollowUp(checkpoint: Checkpoint, index: number,) {
  checkpoint.blipRef ??= renderFollowUpBlip(checkpoint.coordinates, index);

  const secondaryCheckpoint = checkpoint.secondaryCheckpoint;

  if (undefined !== secondaryCheckpoint) {
    secondaryCheckpoint.blipRef ??= renderFollowUpBlip(secondaryCheckpoint.coordinates, index);
  }
}

function renderCheckpoint(c: CheckpointProps, followUpCoordinates: Vector3) {
  return createCheckpoint({
    ...c,
    height: CHECKPOINT.HEIGHT,
    coordinates: {
      target: c.coordinates,
      followUp: followUpCoordinates
    },
    offset: CHECKPOINT.OFFSET
  });
}

function renderTargetBlip(coordinates: Vector3, index: number) {
  return createBlip({
    coordinates,
    color: BLIP_COLOR.YELLOW,
    sprite: BLIP_SPRITE.RADAR_LEVEL,
    scale: BLIP.SCALE.TARGET,
    alpha: BLIP.ALPHA.TARGET,
    index
  });
}

function renderFollowUpBlip(coordinates: Vector3, index: number) {
  return createBlip({
    coordinates,
    color: BLIP_COLOR.DARK_YELLOW,
    sprite: BLIP_SPRITE.RADAR_LEVEL,
    scale: BLIP.SCALE.FOLLOW_UP,
    alpha: BLIP.ALPHA.FOLLOW_UP,
    index
  });
}

function clear(checkpoint: Checkpoint) {
  if (undefined === checkpoint) {
    return;
  }

  if (undefined !== checkpoint.ref) {
    removeCheckpoint({ ...checkpoint });
    checkpoint.ref = undefined;
  }

  if (undefined !== checkpoint.blipRef) {
    removeBlip({ ref: checkpoint.blipRef, coordinates: checkpoint.coordinates });
    checkpoint.blipRef = undefined;
  }

  const sc = checkpoint.secondaryCheckpoint;

  if (undefined !== sc?.ref) {
    removeCheckpoint({ ...sc });
    sc.ref = undefined;
  }

  if (undefined !== sc?.blipRef) {
    removeBlip({ ref: sc.blipRef, coordinates: sc.coordinates });
    sc.blipRef = undefined;
  }
}

export function clearAll() {
  (trackState.currentTrack?.checkpoints ?? []).forEach(c => clear(c));
  logger.debug('Cleared all currently rendered checkpoints');
}
