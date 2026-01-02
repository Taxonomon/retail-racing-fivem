import logger from "../../logging/logger";
import toast from "../../gui/toasts/service";
import callbackService from "../../callback/outbound";
import CALLBACK_NAMES from "../../../common/callback/callback-names";
import playerState from "../state";
import hudService from "../../gui/hud/service";
import trafficService from "../../traffic/service";
import weatherService from "../../weather/service";

async function fetchAndApplyInitialSettings() {
  await fetchFromServer();
  hudService.applyInitialSettings();
  trafficService.applyInitialSettings();
  await weatherService.applyInitialSettings();
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

function updateSetting(key: string, value: any) {
  playerState.settings.set(key, value);
  logger.info(`updated player setting "${key}" to "${value}"`);
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

async function saveSettings() {
  const rawSettings = Object.fromEntries(playerState.settings);
  logger.debug(`will save player settings: ${JSON.stringify(rawSettings)}`);

  const result = await callbackService.triggerServerCallback(
    CALLBACK_NAMES.PLAYER.SETTINGS.SAVE,
    rawSettings
  );

  if (result.error) {
    throw new Error(result.error);
  }

  logger.info(`saved player settings on server`);
}

const playerSettingsService = {
  fetchAndApplyInitialSettings,
  updateSetting,
  getStringSetting,
  getNumberSetting,
  getBooleanSetting,
  saveSettings,
};

export default playerSettingsService;
