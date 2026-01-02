import callback from "../../callback/inbound";
import CALLBACK_NAMES from "../../../common/callback/callback-names";
import playerState from "../state";
import playerSettingsRepo from "./repo";
import playerUtils from "../utils";
import logger from "../../logging/logger";

export default function registerPlayerSettingsCallbacks() {
  callback.register(CALLBACK_NAMES.PLAYER.SETTINGS.FETCH, fetchPlayerSettings);
  callback.register(CALLBACK_NAMES.PLAYER.SETTINGS.SAVE, savePlayerSettings);
}

async function fetchPlayerSettings(netId: number) {
  const playerName = playerUtils.getPlayerNameFromNetId(netId);
  const connectedPlayer = playerState.getConnectedPlayer(netId);

  if (undefined === connectedPlayer) {
    throw new Error(`no connected player found for net id ${netId}`);
  }

  const playerSettings = await playerSettingsRepo.findByPlayer(connectedPlayer.id);

  if (undefined === playerSettings) {
    throw new Error(`no player settings found for net id ${netId} (database result undefined)`);
  }

  logger.info(`fetched player settings for "${playerName}" (net id ${netId})`);
  return playerSettings.settings;
}

async function savePlayerSettings(netId: number, settingsRaw: string) {
  const connectedPlayer = playerState.getConnectedPlayer(netId);
  const playerName = playerUtils.getPlayerNameFromNetId(netId);

  if (undefined === connectedPlayer) {
    throw new Error(`no connected player found for player "${playerName}" (net id ${netId})`);
  }

  const existingSettings = await playerSettingsRepo.findByPlayer(connectedPlayer.id);

  if (undefined === existingSettings) {
    throw new Error(`no existing settings found for player "${playerName}" (net id ${netId})`);
  }

  logger.debug(`will save player settings for player "${playerName}" (net id ${netId}): ${JSON.stringify(settingsRaw)}`);

  const updatedSettings = await playerSettingsRepo.updateByPlayer(
    connectedPlayer.id,
    { settings: settingsRaw }
  );

  if (undefined === updatedSettings) {
    throw new Error(`database error (player settings update query returned undefined entity`);
  }

  logger.info(`updated player settings of "${playerName}" (net id ${netId})`);
}
