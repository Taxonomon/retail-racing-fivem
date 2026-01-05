import {GameMode} from "../../server/game-mode/service";
import {Tick} from "../../common/tick";
import logger from "../logging/logger";

class GameModeState {
  updateMenusBasedOnGameMode: Tick = new Tick('update game mode menus based on game mode', logger);
  gameMode: GameMode = "FREE_MODE";
}

const gameModeState = new GameModeState();

export default gameModeState;
