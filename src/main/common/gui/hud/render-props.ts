import {HudType} from "./hud-type";
import {EntitySpeed} from "../../entity-speed";

export type HudRenderProps = {
  type: HudType;
  speed: EntitySpeed;
  gear?: number | string;
  rpm?: number;
};
