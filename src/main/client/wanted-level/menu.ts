import wantedLevelState from "./state";
import logger from "../logging/logger";

function disable() {
  if (!wantedLevelState.disabled) {
    wantedLevelState.disableWantedLevel.start(() => ClearPlayerWantedLevel(PlayerId()));
    wantedLevelState.disabled = true;
    logger.info('disabled wanted level');
    // toast is disabled because this isn't something the player can control at all atm
  }
}

function enable() {
  if (wantedLevelState.disabled) {
    wantedLevelState.disableWantedLevel.stop();
    wantedLevelState.disabled = false;
    logger.info('enabled wanted level');
    // toast is disabled because this isn't something the player can control at all atm
  }
}

const wantedLevelService = { disable, enable };

export default wantedLevelService;
