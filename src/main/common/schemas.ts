import {Unit} from "./unit/unit";

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface RGBAColor extends RGBColor {
  a: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 extends Vector2 {
  z: number;
}

export interface IdentifiableConstant {
  id: string | number;
  identifier: string;
}

export interface LabeledConstant {
  id: string | number;
  label: string;
}

export interface ValueWithUnit {
  value: number;
  unit: Unit;
}
