import {Vector3} from "../../common/schemas";

export const DEFAULT_CHECKPOINT_HEIGHT = 10;
export const FREEZE_CLIENT_ON_TELEPORT_FOR_MS = 1000;

export const BLIP = {
	TARGET: {
		SCALE: 1.3,
		ALPHA: 255
	},
	FOLLOW_UP: {
		SCALE: 0.65,
		ALPHA: 130
	}
};

export const CHECKPOINT = {
  OFFSET: { x: 0, y: 0, z: -5 } satisfies Vector3
}

export const MENU = {
	ITEM_IDS: {
		HOT_LAP: 'hot-lap'
	}
};
