import {BlipColor, BlipSprite, CheckpointDisplayProps, PropColor} from "../../common/track/schemas";
import {Vector3} from "../../common/schemas";

export interface GetPropsOptions {
  preload?: boolean;
}

export interface CreatePropProps {
  hash: number;
  coordinates: Vector3;
  rotation: Vector3;
  color: PropColor;
  lodDistance: number;
  hasCollision: boolean;
}

export interface RemovePropProps {
  ref: number;
  hash: number;
  coordinates: Vector3;
}

export interface CreateCheckpointProps {
  display: CheckpointDisplayProps;
  coordinates: CreateCheckpointCoordinates;
  size: number;
  height: number;
  offset?: Vector3;
}

export interface CreateCheckpointCoordinates {
  target: Vector3;
  followUp: Vector3;
}

export interface ToggleFixtureRemovalProps {
  hash: number;
  coordinates: Vector3;
  radius: number;
  enable: boolean;
}

export interface CreateBlipProps {
  coordinates: Vector3;
  color: BlipColor;
  sprite: BlipSprite;
  scale: number;
  alpha: number;
}

export interface RemoveBlipProps {
  ref: number;
  coordinates: Vector3;
}
