import logger from "../../logging/logger";
import toast from "../../gui/toasts/service";
import callbackService from "../../callback/outbound";
import CALLBACK_NAMES from "../../../common/callback/callback-names";
import playerState from "../state";
import EVENT_NAMES from "../../../common/event-names";
import hudService from "../../gui/hud/service";

async function fetchAndApplyInitialSettings() {
  await fetchFromServer();
  hudService.applyInitialSettings();
}

async function fetchFromServer() {
  try {
    const { data, error } = await callbackService.triggerServerCallback(CALLBACK_NAMES.PLAYER.SETTINGS.FETCH);

    if (undefined !== error) {
      logger.error(`failed to fetch player settings from server: ${error}`);
      toast.showError(`Failed to fetch player settings from server (see logs for details)`);
      return;
    }

    // const settingsJson = JSON.parse(data);
    playerState.settings = new Map(Object.entries(data));
    logger.debug(`fetched player settings from server: ${JSON.stringify(data)}`);
  } catch (error: any) {
    logger.error(`failed to fetch player settings from server: ${error.message}`);
    toast.showError(`Failed to fetch player settings from server (see logs for details)`);
  }
}

async function updateSetting(key: string, value: any) {
  playerState.settings.set(key, value);
  logger.info(`updated player setting "${key}" to "${value}"`);
}

async function persistSettings() {
  emitNet(EVENT_NAMES.PLAYER.SETTINGS.UPDATE, Object.fromEntries(playerState.settings));
}

function getStringSetting(key: string, fallback: string): string {
  const value: any = playerState.settings.get(key);
  return undefined !== value ? value as string : fallback;
}

function getNumberSetting(key: string, fallback: number): number {
  const value: any = playerState.settings.get(key);
  return undefined !== value ? value as number : fallback;
}

function getBooleanSetting(key: string, fallback: boolean): boolean {
  const value: any = playerState.settings.get(key);
  return undefined !== value ? value as boolean : fallback;
}

const playerSettingsService = {
  fetchAndApplyInitialSettings,
  fetchFromServer,
  updateSetting,
  getStringSetting,
  getNumberSetting,
  getBooleanSetting,
  persistSettings
};

export default playerSettingsService;
