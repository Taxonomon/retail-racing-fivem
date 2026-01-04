import logger from "../../logging/logger";
import toast from "../../gui/toasts/service";
import callbackService from "../../callback/outbound";
import CALLBACK_NAMES from "../../../common/callback/callback-names";
import playerState from "../state";
import {applyHudPlayerSettings} from "../../gui/hud/service";
import {applyTrafficPlayerSettings} from "../../traffic/service";
import {applyWeatherPlayerSettings} from "../../weather/service";
import {applyVehiclePlayerSettings} from "../../vehicle/service";

export const SAVE_PLAYER_SETTINGS_INTERVAL_MS = 30000;

export async function fetchAndApplyPlayerSettings() {
  await fetchFromServer();

  await applyWeatherPlayerSettings();
  applyHudPlayerSettings();
  applyVehiclePlayerSettings();
  applyTrafficPlayerSettings();
}

async function fetchFromServer() {
  try {
    const { data, error } = await callbackService.triggerServerCallback(CALLBACK_NAMES.PLAYER.SETTINGS.FETCH);

    if (undefined !== error) {
      logger.error(`Failed to fetch player settings from server: ${error}`);
      toast.showError(`Failed to fetch player settings from server (see logs for details)`);
      return;
    }

    const settings = new Map(Object.entries(data));
    playerState.settings = settings;
    playerState.lastSavedSettings = settings;
    logger.debug(`Fetched player settings from server: ${JSON.stringify(data)}`);
  } catch (error: any) {
    logger.error(`Failed to fetch player settings from server: ${error.message}`);
    toast.showError(`Failed to fetch player settings from server (see logs for details)`);
  }
}

export function updatePlayerSetting(key: string, value: any) {
  playerState.settings.set(key, value);
  logger.debug(`updated player setting "${key}" to "${value}"`);
}

export function getStringPlayerSetting(key: string, fallback: string): string {
  const value: any = playerState.settings.get(key);
  return undefined !== value ? value as string : fallback;
}

export function getStringArrayPlayerSetting(key: string, fallback: string[]): string[] {
  const value: any = playerState.settings.get(key);
  return undefined !== value ? value : fallback;
}

export function getNumberPlayerSetting(key: string, fallback: number): number {
  const value: any = playerState.settings.get(key);
  return undefined !== value ? value as number : fallback;
}

export function getBooleanPlayerSetting(key: string, fallback: boolean): boolean {
  const value: any = playerState.settings.get(key);
  return undefined !== value ? value as boolean : fallback;
}

export async function startSavingPlayerSettingsPeriodically() {
  playerState.saveSettings.start(async () => {
    const currentSettingsString = JSON.stringify(Object.fromEntries(playerState.settings));
    const lastSubmittedSettingsString = JSON.stringify(Object.fromEntries(playerState.lastSavedSettings));

    logger.trace(`startSavingPlayerSettingsPeriodically: `
      + `currentSettingsString=${currentSettingsString}, `
      + `lastSubmittedSettingsStrin=${lastSubmittedSettingsString}`
    );

    if (currentSettingsString !== lastSubmittedSettingsString) {
      logger.debug(`Detected changes in player settings; will try to save settings now`);
      try {
        await savePlayerSettings();
        playerState.lastSavedSettings = new Map(playerState.settings);
        logger.debug(`Saved player settings`);
      } catch (error: any) {
        logger.error(`Failed to save player settings: ${error.message}`);
      }
    } else {
      logger.debug(`No changes in player settings detected`);
    }
  }, SAVE_PLAYER_SETTINGS_INTERVAL_MS);
}

export async function savePlayerSettings() {
  const rawSettings = Object.fromEntries(playerState.settings);
  logger.debug(`Will save the following raw player settings: ${JSON.stringify(rawSettings)}`);

  const result = await callbackService.triggerServerCallback(
    CALLBACK_NAMES.PLAYER.SETTINGS.SAVE,
    rawSettings
  );

  if (result.error) {
    throw new Error(result.error);
  }
}
