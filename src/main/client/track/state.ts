import {TrackFromServer} from "../../common/track/schemas";
import {Tick} from "../../common/tick";
import logger from "../logging/logger";
import {ParsedTrack} from "./schemas";

class TrackState {
  private _trackList?: TrackFromServer[];
  updateNearbyTrackObjects: Tick = new Tick('update nearby track objects', logger);

  currentTrack?: ParsedTrack;

  get trackList() {
    return this._trackList ?? [];
  }

  set trackList(value: TrackFromServer[]) {
    this._trackList = value;
  }
}

export const trackState = new TrackState();
