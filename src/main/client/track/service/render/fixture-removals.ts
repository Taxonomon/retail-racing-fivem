import {trackState} from "../../state";
import {toggleFixtureRemoval} from "../objects/fixture-removal";
import logger from "../../../logging/logger";
import {FixtureRemoval} from "../../../../common/track/schemas";
import {withinPlayerRadius} from "../../../player/coordinates";
import {RENDER_NEARBY} from "../../constants";

export function start() {
  const track = trackState.currentTrack;

  if (undefined === track) {
    throw new Error('No current track found to render fixture removals for');
  }

  stop();

  switch (track.renderStrategy.fixtureRemovals) {
    case 'ALL': {
      renderAll();
      break;
    }
    case 'NEARBY': {
      trackState.renderNearbyFixtureRemovals.start(() => renderNearby());
      break;
    }
    case 'NONE': {
      // do nothing
      break;
    }
  }
}

export function stop() {
  if (trackState.renderNearbyFixtureRemovals.isRunning()) {
    trackState.renderNearbyFixtureRemovals.stop();
  }
  clearAll();
  logger.debug(`Stopped rendering fixture removals of current track`);
}

function renderAll() {
  (trackState.currentTrack?.fixtureRemovals ?? []).forEach(render);
  logger.debug(`Rendered all fixture removals of current track`);
}

function renderNearby() {
  const fixtureRemovals = trackState.currentTrack?.fixtureRemovals;

  if (undefined === fixtureRemovals || 0 === fixtureRemovals.length) {
    return;
  }

  fixtureRemovals.forEach(fr => {
    if (withinPlayerRadius(fr.coordinates, RENDER_NEARBY.DETECTION_RADIUS)) {
      render(fr);
    } else {
      clear(fr);
    }
  });
}

function render(fr: FixtureRemoval) {
  if (!fr.enabled) {
    toggleFixtureRemoval({ ...fr, enable: true });
    fr.enabled = true;
  }
}

function clear(fr: FixtureRemoval) {
  if (fr.enabled) {
    toggleFixtureRemoval({...fr, enable: false});
    fr.enabled = false;
  }
}

export function clearAll() {
  (trackState.currentTrack?.fixtureRemovals ?? []).forEach(clear);
  logger.debug(`Cleared all currently rendered fixture removals`);
}
