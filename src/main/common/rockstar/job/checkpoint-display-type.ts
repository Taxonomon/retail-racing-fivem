export type CheckpointDisplayType = {
  identifier: string;
  index: number;
};

export const NONE: CheckpointDisplayType = {
  identifier: 'NONE',
  index: 49
};

export const SINGLE_ARROW: CheckpointDisplayType = {
  identifier: 'SINGLE_ARROW',
  index: 0
};

export const REPEAT: CheckpointDisplayType = {
  identifier: 'REPEAT',
  index: 3
};

export const FINISH: CheckpointDisplayType = {
  identifier: 'FINISH',
  index: 4
};

export const CHECKPOINT_DISPLAY_TYPES = [
  NONE,
  SINGLE_ARROW,
  REPEAT,
  FINISH
];
