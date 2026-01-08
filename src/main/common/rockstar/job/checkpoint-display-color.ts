import {RGBColor} from "../../color";

export type CheckpointDisplayColor = {
  cylinder: RGBColor;
  icon: RGBColor;
};

export const RETAIL: CheckpointDisplayColor = {
  cylinder: { r: 215,  g: 212,  b: 194,  a: 100 }, // light, faded yellow
  icon: { r: 18,  g: 122,  b: 219,  a: 100 } // sky blue
};
