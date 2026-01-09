import {Vector3} from "../../vector";

export type Prop = {
  ref?: number;
  hash: number;
  isDynamic: boolean;
  coordinates: Vector3;
  rotation: Vector3;
  hasCollision: boolean;
  color?: number;
  persistWhileOutOfRange?: boolean;
};

export const PROP_ROTATION_ORDER = {
  Z_Y_X: 2
};
