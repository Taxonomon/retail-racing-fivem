import {EntitySpeed} from "../../entity-speed";

export type HudRenderProps = {
  speed: EntitySpeed;
  gear?: number | string;
  rpm?: number;
};
