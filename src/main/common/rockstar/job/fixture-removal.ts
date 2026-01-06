import {Vector3} from "../../vector";

export type FixtureRemoval = {
  ref?: number;
  hash: number;
  coordinates: Vector3;
  radius: number;
};
