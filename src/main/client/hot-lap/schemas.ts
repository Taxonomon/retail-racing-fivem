import {Checkpoint, FixtureRemoval, Prop, TrackFromServer} from "../../common/track/schemas";

export interface ActiveHotLapTrack extends TrackFromServer {
  props: Prop[],
  fixtureRemovals: FixtureRemoval[],
  checkpoints: Checkpoint[]
}
