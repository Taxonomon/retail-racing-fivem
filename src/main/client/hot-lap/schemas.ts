import {Checkpoint, FixtureRemoval, Prop, TrackFromServer} from "../../common/track/schemas";
import {IdentifiableConstant, Vector3} from "../../common/schemas";

export interface ActiveHotLapTrack extends TrackFromServer {
  props: Prop[],
  fixtureRemovals: FixtureRemoval[],
  checkpoints: Checkpoint[]
}

export interface CreateCheckpointWithBlipProps {
  checkpoint: Checkpoint;
  followUpCoordinates: Vector3;
  blip: CreateCheckpointWithBlipBlipProps
}

export interface CreateCheckpointWithBlipBlipProps {
  sprite: IdentifiableConstant;
  color: IdentifiableConstant;
  scale: number;
  alpha: number;
}
