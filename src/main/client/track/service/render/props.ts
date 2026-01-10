import {trackState} from "../../state";
import logger from "../../../logging/logger";
import {withinPlayerRadius} from "../../../player/coordinates";
import {PROP, RENDER_NEARBY} from "../../constants";
import {Prop} from "../../../../common/track/schemas";
import {createProp, removeProp} from "../objects/prop";

export function start() {
  const track = trackState.currentTrack;

  if (undefined === track) {
    throw new Error('No current track found to render props for');
  }

  stop();

  switch (track.renderStrategy.props) {
    case 'ALL': {
      renderAll();
      break;
    }
    case 'NEARBY': {
      trackState.renderNearbyProps.start(() => renderNearby());
      break;
    }
    case 'NONE': {
      // do nothing
      break;
    }
  }
}

export function stop() {
  if (trackState.renderNearbyProps.isRunning()) {
    trackState.renderNearbyProps.stop();
  }
  clearAll();
  logger.debug(`Stopped rendering props of current track`);
}

function renderAll() {
  (trackState.currentTrack?.props ?? []).forEach(render);
  logger.debug(`Rendered all props of current track`);
}

async function renderNearby() {
  const props = trackState.currentTrack?.props;

  if (undefined === props || 0 === props.length) {
    return;
  }

  for (const p of props) {
    if (withinPlayerRadius(p.coordinates, RENDER_NEARBY.DETECTION_RADIUS)) {
      await render(p);
    } else {
      clear(p);
    }
  }
}

async function render(p: Prop) {
  p.ref ??= await createProp({ ...p, lodDistance: PROP.LOD_DISTANCE.DEFAULT });
}

function clear(p: Prop) {
  if (undefined !== p.ref) {
    removeProp({ ...p, ref: p.ref });
    p.ref = undefined;
  }
}

export function clearAll() {
  (trackState.currentTrack?.props ?? []).forEach(clear);
  logger.debug(`Cleared all currently rendered props`);
}
