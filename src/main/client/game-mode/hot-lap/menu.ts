import {removeMenu} from "../../gui/menu/api/service";
import MENU_IDS from "../../gui/menu/menu-ids";
import gameModeState from "../state";
import logger from "../../logging/logger";

export function initializeHotLapMenu() {
  setHotLapMenuBasedOnGameMode();

  // the hot lap menu looks different depending on the client's game mode
  //
  // free mode:
  // - simply a list of all tracks
  //
  // hot lap:
  // - reset
  // - respawn
  // - set spawn checkpoint
  //   - label with current
  //   - input for number
  //   - +1/-1 action items
  // - (order the following the same as in settings menu):
  // - weather
  // - time
  //   - set time of day (morning, noon, evening, midnight)
  //   - set custom hour
  //   - freeze time
  // - traffic
  //
  // race:
  // - disabled/removed -> player has to exit race and switch to free mode first
}

export function setHotLapMenuBasedOnGameMode() {
  switch (gameModeState.gameMode) {
    case "FREE_MODE": {
      setFreeModeMenu();
      break;
    }
    case "HOT_LAP": {
      setHotLapMenu();
      break;
    }
    case "RACE": {
      setRaceMenu();
      break;
    }
  }
}

function setFreeModeMenu() {}

function setHotLapMenu() {}

function setRaceMenu() {
  removeMenu(MENU_IDS.HOT_LAP.MAIN);
}
