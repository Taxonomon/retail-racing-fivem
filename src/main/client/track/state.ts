import {TrackFromServer} from "../../common/track/schemas";
import {Tick} from "../../common/tick";
import logger from "../logging/logger";
import {ParsedTrack} from "./schemas";

class TrackState {
  private _trackList?: TrackFromServer[];

  currentTrack?: ParsedTrack;

  // checkpoint stuff
  currentLap: number = 0; // can only be counted if checkpoint render strategy is 'NEXT'
  currentCheckpointIndex: number = Number.NaN;
  renderNextCheckpoints: Tick = new Tick('render next checkpoints of current track', logger);

  renderProps: Tick = new Tick('render current track props', logger);
  renderFixtureRemovals: Tick = new Tick('render current track fixture removals', logger);

  get trackList() {
    return this._trackList ?? [];
  }

  set trackList(value: TrackFromServer[]) {
    this._trackList = value;
  }
}

export const trackState = new TrackState();
