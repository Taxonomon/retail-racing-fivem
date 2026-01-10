import {TrackFromServer} from "../../../../common/track/schemas";
import {stop as stopRenderingProps, start as startRenderingProps} from "./props";
import {stop as stopRenderingFixtureRemovals, start as startRenderingFixtureRemovals} from "./fixture-removals";
import {stop as stopRenderingCheckpoints, start as startRenderingCheckpoints} from "./checkpoints";
import {ParsedTrack, TrackRenderStrategy} from "../../schemas";
import {parseJobCheckpoints, parseJobFixtureRemovals, parseJobProps} from "../../../../common/track/service/parse";
import {trackState} from "../../state";
import logger from "../../../logging/logger";

export function start(
  track: TrackFromServer,
  renderStrategy: TrackRenderStrategy,
  options?: { withSound: boolean }
) {
  trackState.currentTrack = toParsedTrack(track, renderStrategy);
  startRenderingProps();
  startRenderingFixtureRemovals();
  startRenderingCheckpoints(options);
  logger.debug(`Started rendering current track "${track.name}"`);
}

export function stop() {
  stopRenderingProps();
  stopRenderingFixtureRemovals();
  stopRenderingCheckpoints();
  logger.debug(`Stopped rendering current track "${trackState.currentTrack?.name}"`);
}

function toParsedTrack(track: TrackFromServer, renderStrategy: TrackRenderStrategy): ParsedTrack {
  return {
    ...track,
    renderStrategy,
    props: parseJobProps(track.data),
    fixtureRemovals: parseJobFixtureRemovals(track.data),
    checkpoints: parseJobCheckpoints(track.data),
  };
}
