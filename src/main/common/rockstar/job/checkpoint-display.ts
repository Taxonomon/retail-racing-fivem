import {CheckpointDisplayType, SINGLE_ARROW} from "./checkpoint-display-type";
import {CheckpointDisplayColor, RETAIL} from "./checkpoint-display-color";

export type CheckpointDisplay = {
  type: CheckpointDisplayType;
  color: CheckpointDisplayColor;
};

export const DEFAULT: CheckpointDisplay = {
  type: SINGLE_ARROW,
  color: RETAIL
};
