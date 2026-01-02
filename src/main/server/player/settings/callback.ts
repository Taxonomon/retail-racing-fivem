import callback from "../../callback/inbound";
import CALLBACK_NAMES from "../../../common/callback/callback-names";
import playerState from "../state";
import playerSettingsRepo from "./repo";
import playerUtils from "../utils";
import logger from "../../logging/logger";

export default function registerFetchPlayerSettingsCallback() {
  callback.register(CALLBACK_NAMES.PLAYER.SETTINGS.FETCH, fetchPlayerSettings);
}

async function fetchPlayerSettings(netId: number) {
  logger.debug(
    `fetching player settings for `
    + `"${playerUtils.getPlayerNameFromNetId(netId)}" (net id ${netId})`
  );
  
  const player = playerState.getConnectedPlayer(netId);

  if (undefined === player) {
    throw new Error(`no connected player found for net id ${netId}`);
  }

  const playerSettings = await playerSettingsRepo.findByPlayer(player);

  if (undefined === playerSettings) {
    throw new Error(`no player settings found for net id ${netId} (database result undefined)`);
  }

  return playerSettings.settings;
}
