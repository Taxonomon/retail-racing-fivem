import {CheckpointRenderStrategy, FixtureRemovalRenderStrategy, PropRenderStrategy} from "./schemas";
import {Vector3} from "../../common/schemas";

export const UPDATE_NEARBY_TRACK_OBJECTS = {
	INTERVAL_MS: 1500,
  DETECTION_RADIUS: 1000
};

export const BLIP = {
  ALPHA: {
    TARGET: 255,
    FOLLOW_UP: 130
  },
	PLACEMENT_MODE: {
		MAIN_MAP_AND_MINIMAP_SELECTABLE_ON_MAP: 6
	},
  SCALE: {
    TARGET: 1.3,
    FOLLOW_UP: 0.65
  },
  SPRITE: {
    TARGET:
  }
};

export const CHECKPOINT = {
  HEIGHT: 10,
  OFFSET: {
    x: 0,
    y: 0,
    z: -5
  } satisfies Vector3,
  RENDER_STRATEGY: {
    NONE: 'NONE' satisfies CheckpointRenderStrategy,
    ALL: 'ALL' satisfies CheckpointRenderStrategy,
    NEXT: 'NEXT' satisfies CheckpointRenderStrategy
  }
};

export const FIXTURE_REMOVAL = {
  RENDER_STRATEGY: {
    NONE: 'NONE' satisfies FixtureRemovalRenderStrategy,
    ALL: 'ALL' satisfies FixtureRemovalRenderStrategy,
    NEARBY: 'NEARBY' satisfies FixtureRemovalRenderStrategy
  }
};

export const PROP = {
  LOD_DISTANCE: {
    DEFAULT: 16960
  },
  RENDER_STRATEGY: {
    NONE: 'NONE' satisfies PropRenderStrategy,
    ALL: 'ALL' satisfies PropRenderStrategy,
    NEARBY: 'NEARBY' satisfies PropRenderStrategy
  },
  ROTATION_ORDER: {
    Z_Y_X: 0,
    X_Y_Z: 5,
    Z_X_Y: 2
  }
};
