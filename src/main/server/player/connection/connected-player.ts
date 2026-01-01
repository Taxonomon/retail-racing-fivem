import {Player} from "../schema";
import {GameMode} from "../../game-mode/game-mode";

export type ConnectedPlayer = Player & {
  netId: number;
  principals: string[];
  permissions: string[];
  gameMode: GameMode;
};
