import {TrackFromServer} from "../../../../common/track/schemas";
import {stop as stopRenderingProps, start as startRenderingProps} from "./props";
import {stop as stopRenderingFixtureRemovals, start as startRenderingFixtureRemovals} from "./fixture-removals";
import {stop as stopRenderingCheckpoints, start as startRenderingCheckpoints} from "./checkpoints";
import {ParsedTrack, StartRenderTrackProps} from "../../schemas";
import {parseJobCheckpoints, parseJobFixtureRemovals, parseJobProps} from "../../../../common/track/service/parse";
import {trackState} from "../../state";
import logger from "../../../logging/logger";

export function start(props: StartRenderTrackProps) {
  trackState.currentTrack = props.track;
  trackState.renderStrategy = props.renderStrategy;
  trackState.spawnPoint = props.spawnPoint;
  trackState.initialCheckpointIndex = props.initialCheckpointIndex;

  startRenderingProps();
  startRenderingFixtureRemovals();
  startRenderingCheckpoints({ withSound: props.withSound });

  logger.debug(`Started rendering current track "${props.track.name}"`);
}

export function stop() {
  stopRenderingProps();
  stopRenderingFixtureRemovals();
  stopRenderingCheckpoints();
  trackState.currentCheckpointIndex = Number.NaN;
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
