import {Player} from "../schema";

export type ConnectedPlayer = Player & {
  netId: number;
  principals: string[];
  permissions: string[];
};
