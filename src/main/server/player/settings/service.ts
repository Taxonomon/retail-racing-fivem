import {registerServerCallback} from "../../callback/service";
import CALLBACK_NAMES from "../../../common/callback/callback-names";
import playerState from "../state";
import logger from "../../logging/logger";
import {
  findPlayerSettingsByPlayerId,
  insertPlayerSettings,
  updatePlayerSettingsByPlayerId
} from "./database";
import {getPlayerNameFromNetId} from "../service";

const SAVE_PLAYER_SETTINGS_TIMEOUT_MS = 1000;

export function registerPlayerSettingsCallbacks() {
  registerServerCallback(
    CALLBACK_NAMES.PLAYER.SETTINGS.FETCH,
    fetchPlayerSettings
  );

  registerServerCallback(
    CALLBACK_NAMES.PLAYER.SETTINGS.SAVE,
    savePlayerSettings
  );
}

async function fetchPlayerSettings(netId: number) {
  const playerName = getPlayerNameFromNetId(netId);
  const connectedPlayer = playerState.getConnectedPlayer(netId);
  const playerSettings = await findPlayerSettingsByPlayerId(connectedPlayer.id);

  if (undefined === playerSettings) {
    throw new Error(`no player settings found for net id ${netId} (database result undefined)`);
  }

  logger.info(`Fetched player settings for "${playerName}" (net id ${netId})`);
  return playerSettings.settings;
}

async function savePlayerSettings(netId: number, settingsRaw: string) {
  if (Date.now() - playerState.playerSettingsLastSavedAt.getTime() < SAVE_PLAYER_SETTINGS_TIMEOUT_MS) {
    throw new Error(`Player settings were just saved`);
  }

  const player = playerState.getConnectedPlayer(netId);
  const playerName = getPlayerNameFromNetId(netId);

  await getOrCreatePlayerSettingsByPlayerId(player.id);
  const updatedSettings = await updatePlayerSettingsByPlayerId(player.id, { settings: settingsRaw });

  if (undefined !== updatedSettings) {
    playerState.playerSettingsLastSavedAt = new Date();
    logger.info(`Updated player settings of "${playerName}" (net id ${netId})`);
    logger.debug(`Set player settings of "${playerName}" (net id ${netId}) to ${updatedSettings.settings}`);
  }
}

export async function getOrCreatePlayerSettingsByPlayerId(player: number) {
  return await findPlayerSettingsByPlayerId(player) ?? await insertPlayerSettings({
    player: player,
    settings: JSON.stringify(Object.fromEntries(new Map()))
  });
}
