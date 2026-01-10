import {CheckpointPlacementStrategy} from "./schemas";

export const UPDATE_NEARBY_TRACK_OBJECTS = {
	INTERVAL_MS: 1500,
  DETECTION_RADIUS: 1000
};

export const CREATE_PROP = {
	LOD_DISTANCE: {
		DEFAULT: 16960
	},
	ROTATION_ORDER: {
		Z_Y_X: 0,
		X_Y_Z: 5,
		Z_X_Y: 2
	}
};

export const CREATE_BLIP = {
	PLACEMENT_MODE: {
		MAIN_MAP_AND_MINIMAP_SELECTABLE_ON_MAP: 6
	}
};

export const CHECKPOINT_PLACEMENT_STRATEGY = {
  NONE: 'NONE' satisfies CheckpointPlacementStrategy,
  ALL: 'ALL' satisfies CheckpointPlacementStrategy,
  NEXT: 'NEXT' satisfies CheckpointPlacementStrategy
};
