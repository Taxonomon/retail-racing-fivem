import {Vector3} from "../../vector";

export type FixtureRemoval = {
  enabled: boolean;
  hash: number;
  coordinates: Vector3;
  radius: number;
  persistWhileOutOfRange?: boolean;
};
