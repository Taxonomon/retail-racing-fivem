import {Checkpoint, CheckpointDisplayProps, FixtureRemoval, Prop, TrackFromServer} from "../../common/track/schemas";
import {IdentifiableConstant, Vector3} from "../../common/schemas";

export interface GetPropsOptions {
  preload?: boolean;
}

export interface CreatePropProps {
  hash: number;
  coordinates: Vector3;
  rotation: Vector3;
  textureVariant?: number;
  lodDistance: number;
  hasCollision: boolean;
}

export interface RemovePropProps {
  ref: number;
  hash: number;
  coordinates: Vector3;
  unload?: boolean;
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
  color: IdentifiableConstant;
  sprite: IdentifiableConstant;
  scale: number;
  alpha: number;
  index?: number;
}

export interface RemoveBlipProps {
  ref: number;
  coordinates: Vector3;
}

export type CheckpointRenderStrategy = 'NONE' | 'ALL' | 'NEXT';
export type PropRenderStrategy = 'NONE' | 'ALL' | 'NEARBY';
export type FixtureRemovalRenderStrategy = 'NONE' | 'ALL' | 'NEARBY';

export interface TrackRenderStrategy {
  props: PropRenderStrategy;
  fixtureRemovals: FixtureRemovalRenderStrategy;
  checkpoints: CheckpointRenderStrategy;
}

export interface ParsedTrack extends TrackFromServer {
  props: Prop[];
  fixtureRemovals: FixtureRemoval[];
  checkpoints: Checkpoint[];
}

export interface StartRenderTrackProps {
  track: ParsedTrack;
  renderStrategy: TrackRenderStrategy;
  spawnPoint: Vector3;
  initialCheckpointIndex: number;
  withSound: boolean;
}

export interface OnTrackCheckpointPassedEventProps {
  lap: number;
  checkpointIndex: number;
  passedAt: number;
}
