import {TrackFromServer} from "../../../../common/track/schemas";
import {stop as stopRenderingProps, start as startRenderingProps} from "./props";
import {stop as stopRenderingFixtureRemovals, start as startRenderingFixtureRemovals} from "./fixture-removals";
import {stop as stopRenderingCheckpoints, start as startRenderingCheckpoints} from "./checkpoints";
import {ParsedTrack, TrackRenderStrategy} from "../../schemas";
import {parseJobCheckpoints, parseJobFixtureRemovals, parseJobProps} from "../../../../common/track/service/parse";
import {trackState} from "../../state";
import logger from "../../../logging/logger";
import {Vector3} from "../../../../common/vector";

export function start(
  track: ParsedTrack,
  renderStrategy: TrackRenderStrategy,
  spawnPoint: Vector3,
  options?: { withSound: boolean }
) {
  trackState.currentTrack = track;
  trackState.renderStrategy = renderStrategy;
  trackState.spawnPoint = spawnPoint;
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

export function toParsedTrack(track: TrackFromServer,): ParsedTrack {
  return {
    ...track,
    props: parseJobProps(track.data),
    fixtureRemovals: parseJobFixtureRemovals(track.data),
    checkpoints: parseJobCheckpoints(track.data),
  };
}
