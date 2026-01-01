import wantedLevelState from "./state";
import logger from "../logging/logger";
import toast from "../gui/toasts/service";

function disable() {
  if (!wantedLevelState.disabled) {
    wantedLevelState.disableWantedLevel.start(() => ClearPlayerWantedLevel(PlayerId()));
    wantedLevelState.disabled = true;
    logger.info('disabled wanted level');
    toast.showInfo('Disabled wanted level');
  }
}

function enable() {
  if (wantedLevelState.disabled) {
    wantedLevelState.disableWantedLevel.stop();
    wantedLevelState.disabled = false;
    logger.info('enabled wanted level');
    toast.showInfo('Enabled wanted level');
  }
}

const wantedLevelService = { disable, enable };

export default wantedLevelService;
