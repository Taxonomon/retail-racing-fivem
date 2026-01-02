import {EntitySpeed} from "../../entity-speed";

export type HudRenderProps = {
  type: string;
  speed: EntitySpeed;
  gear?: number | string;
  rpm?: number;
};
