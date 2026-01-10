import {ParsedTrack} from "../../schemas";
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

export function start(track: ParsedTrack, options?: { withSound?: boolean }) {
  trackState.currentTrack = track;
  clearAll({ includingBlips: true });

  switch (track.renderStrategy.checkpoints) {
    case 'ALL': {
      renderAll();
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
    + `using render strategy ${track.renderStrategy.checkpoints}`
  );
}

function renderAll() {
  (trackState.currentTrack?.checkpoints ?? []).forEach((
    curr: Checkpoint,
    i: number,
    all: Checkpoint[]
  ) => {
    curr.ref ??= renderCheckpoint(curr, (all[i + 1] ?? all[0]).coordinates);
    curr.blipRef ??= renderTargetBlip(curr.coordinates, i);
  });
}

function renderNext(options?: { withSound?: boolean }) {
  const checkpoints = trackState.currentTrack?.checkpoints;

  if (undefined === checkpoints || 0 === checkpoints.length) {
    return;
  }

  const currentIndex = Number.isNaN(trackState.currentCheckpointIndex) ? 0 : trackState.currentCheckpointIndex;

  const targetIndex = currentIndex === checkpoints.length - 1 ? 0 : currentIndex + 1;
  const target = checkpoints.at(targetIndex);

  const followUpIndex = targetIndex === checkpoints.length - 1 ? 0 : targetIndex + 1;
  const followUp = checkpoints.at(followUpIndex);

  if (undefined === target || undefined === followUp) {
    return;
  }

  renderTarget(target, followUp.coordinates, targetIndex, { withBlip: true });
  renderFollowUp(followUp, followUpIndex, { withBlip: true });

  const withinTargetRadius = withinPlayerRadius(target.coordinates, target.size);
  const withinTargetSecondaryRadius = undefined !== target.secondaryCheckpoint
   && withinPlayerRadius(target.secondaryCheckpoint.coordinates, target.secondaryCheckpoint.size);

  if (withinTargetRadius || withinTargetSecondaryRadius) {
    const now = GetGameTimer();
    const withSound = options?.withSound ?? false;

    clear(target, { includingBlips: true });
    clear(followUp, { includingBlips: true });

    trackState.currentCheckpointIndex = targetIndex;

    if (0 === targetIndex) {
      trackState.currentLap++;
      if (withSound) {
        playSound.lapCompleted();
      }
    } else if (withSound) {
      playSound.checkpointHit();
    }

    emit(EVENT_NAMES.TRACK.CHECKPOINT.PASSED, {
      index: currentIndex,
      timestamp: now
    });
  }
}

function renderTarget(
  c: Checkpoint,
  followUpCoordinates: Vector3,
  index: number,
  options?: { withBlip?: boolean }
) {
  const withBlip = options?.withBlip ?? false;

  c.ref ??= renderCheckpoint(c, followUpCoordinates);

  if (withBlip) {
    c.blipRef ??= renderTargetBlip(c.coordinates, index);
  }

  const sc = c.secondaryCheckpoint;

  if (undefined !== sc) {
    sc.ref ??= renderCheckpoint(sc, followUpCoordinates);
    sc.blipRef ??= renderTargetBlip(sc.coordinates, index);
  }
}

function renderFollowUp(
  c: Checkpoint,
  index: number,
  options?: { withBlip?: boolean }
) {
  const withBlip = options?.withBlip ?? false;

  c.blipRef ??= renderFollowUpBlip(c.coordinates, index);

  const sc = c.secondaryCheckpoint;

  if (undefined !== sc) {
    sc.blipRef ??= renderFollowUpBlip(sc.coordinates, index);
  }
}

function renderCheckpoint(c: CheckpointProps, followUpCoordinates: Vector3) {
  return createCheckpoint({
    ...c,
    height: CHECKPOINT.HEIGHT,
    coordinates: {
      target: c.coordinates,
      followUp: followUpCoordinates
    }
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

export function stop() {
  clearAll({ includingBlips: true });
  logger.debug(`Stopped rendering checkpoints of current track`);
}

function clear(checkpoint: Checkpoint, options?: { includingBlips?: boolean }) {
  const includeBlips = options?.includingBlips ?? false;

  if (undefined === checkpoint) {
    return;
  } else if (undefined !== checkpoint.ref) {
    removeCheckpoint({ ...checkpoint });
    checkpoint.ref = undefined;
  } else if (includeBlips && undefined !== checkpoint.blipRef) {
    removeBlip({ ref: checkpoint.blipRef, coordinates: checkpoint.coordinates });
    checkpoint.blipRef = undefined;
  }

  const sc = checkpoint.secondaryCheckpoint;

  if (undefined !== sc?.ref) {
    removeCheckpoint({ ...sc });
    sc.ref = undefined;
  } else if (includeBlips && undefined !== sc?.blipRef) {
    removeBlip({ ref: sc.blipRef, coordinates: sc.coordinates });
    sc.blipRef = undefined;
  }
}

function clearAll(options?: { includingBlips?: boolean }) {
  (trackState.currentTrack?.checkpoints ?? []).forEach(c => clear(c, options));
  logger.debug(`Cleared all currently rendered checkpoints (including blips)`);
}
