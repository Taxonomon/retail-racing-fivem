import {Vector3} from "../../vector";

export type CheckpointProps = {
  coordinates: Vector3;
};

export type Checkpoint = CheckpointProps & {
  secondaryCheckpoint: CheckpointProps;
};
