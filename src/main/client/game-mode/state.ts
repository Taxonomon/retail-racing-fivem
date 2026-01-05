import {Tick} from "../../common/tick";
import logger from "../logging/logger";
import {GameMode} from "../../common/game-mode/game-mode";

class GameModeState {
  updateMenusBasedOnGameMode: Tick = new Tick('update game mode menus based on game mode', logger);
  gameMode: GameMode = "FREE_MODE";
}

const gameModeState = new GameModeState();

export default gameModeState;
