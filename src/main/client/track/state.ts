import {TrackFromServer} from "../../common/track/schemas";
import {Tick} from "../../common/tick";
import logger from "../logging/logger";
import {ParsedTrack, TrackRenderStrategy} from "./schemas";
import {Vector3} from "../../common/schemas";

class TrackState {
  private _trackList?: TrackFromServer[];
  private _spawnPoint?: Vector3;
  private _renderStrategy?: TrackRenderStrategy;

  currentTrack?: ParsedTrack;

  // checkpoint stuff
  currentLap: number = 0; // can only be counted if checkpoint render strategy is 'NEXT'
  initialCheckpointIndex: number = Number.NaN;
  currentCheckpointIndex: number = Number.NaN;
  renderNextCheckpoints: Tick = new Tick('render next checkpoints of current track', logger);

  renderNearbyProps: Tick = new Tick('render nearby props of current track', logger);
  renderNearbyFixtureRemovals: Tick = new Tick('render nearby fixture removals of current track', logger);

  get trackList() {
    return this._trackList ?? [];
  }

  set trackList(value: TrackFromServer[]) {
    this._trackList = value;
  }

  get spawnPoint() {
    if (undefined === this._spawnPoint) {
      throw new Error('Spawn point undefined');
    }
    return this._spawnPoint;
  }

  set spawnPoint(value: Vector3) {
    this._spawnPoint = value;
  }

  get renderStrategy() {
    if (undefined === this._renderStrategy) {
      throw new Error('Render strategy undefined');
    }
    return this._renderStrategy;
  }

  set renderStrategy(value: TrackRenderStrategy) {
    this._renderStrategy = value;
  }
}

export const trackState = new TrackState();
