import {TrackFromServer} from "../../common/track/schemas";

class TrackState {
  private _trackList?: TrackFromServer[];

  get trackList() {
    return this._trackList ?? [];
  }

  set trackList(value: TrackFromServer[]) {
    this._trackList = value;
  }
}

export const trackState = new TrackState();
