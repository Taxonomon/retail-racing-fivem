import {Vector3} from "../../vector";
import {CheckpointDisplay} from "./checkpoint-display";
import {CheckpointEffects} from "./checkpoint-effect";

export type CheckpointProps = {
  ref?: number;
  blipRef?: number;
  coordinates: Vector3;
  heading: number;
  size: number;
  display: CheckpointDisplay;
};

export type Checkpoint = CheckpointProps & {
  secondaryCheckpoint?: CheckpointProps;
  effects: CheckpointEffects;
};
