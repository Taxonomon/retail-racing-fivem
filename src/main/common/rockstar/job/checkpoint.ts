import {Vector3} from "../../vector";
import {CheckpointEffect} from "./checkpoint-effect";

export type CheckpointProps = {
  ref?: number;
  coordinates: Vector3;
  heading: number;
  size: number;
};

export type Checkpoint = CheckpointProps & {
  effects: CheckpointEffect[];
  secondaryCheckpoint?: CheckpointProps;
};
