import {IdentifiableConstant, RGBAColor} from "../schemas";
import {Vector3} from "../vector";

export interface TrackFromServer {
  name: string;
  author: string;
  description?: string;
  data: string;
  hash: string;
  enabled: boolean;
}

export interface CheckpointProps {
  ref?: number;
  blipRef?: number;
  coordinates: Vector3;
  heading: number;
  size: number;
  display: CheckpointDisplay;
}

export interface Checkpoint extends CheckpointProps {
  secondaryCheckpoint?: CheckpointProps;
  effects: CheckpointEffects;
}

export interface CheckpointDisplayProps {
  type: CheckpointDisplayType;
  color: CheckpointDisplayColor;
}

export interface CheckpointDisplay {
  type: CheckpointDisplayType;
  color: CheckpointDisplayColor;
}

export interface CheckpointDisplayType extends IdentifiableConstant {
  reserved: boolean;
}

export interface CheckpointDisplayColor {
  cylinder: RGBAColor,
  icon: RGBAColor
}

export interface CheckpointEffect extends IdentifiableConstant {
  cpbsType: 1 | 2;
  apply?: (checkpoint: Checkpoint) => Checkpoint;
}

export type CheckpointEffects = [
  cpbs1?: CheckpointEffect,
  cpbs2?: CheckpointEffect
];

export interface FixtureRemoval {
  enabled: boolean;
  hash: number;
  coordinates: Vector3;
  radius: number;
  persistWhileOutOfRange?: boolean;
}

export interface Prop {
  ref?: number;
  hash: number;
  isDynamic: boolean;
  coordinates: Vector3;
  rotation: Vector3;
  hasCollision: boolean;
  textureVariant?: number;
  persistWhileOutOfRange?: boolean;
}
