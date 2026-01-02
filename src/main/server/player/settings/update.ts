import EVENT_NAMES from "../../../common/event-names";
import playerUtils from "../utils";
import playerState from "../state";
import logger from "../../logging/logger";
import playerSettingsRepo from "./repo";
import {LOG_LEVELS} from "../../../common/logging/level";

export default function registerPlayerSettingsUpdateListener() {
  onNet(EVENT_NAMES.PLAYER.SETTINGS.UPDATE, async (settingsRaw: string) => {
    const netId = Number(globalThis.source);
    await handlePlayerSettingsUpdate(netId, settingsRaw);
  });
}

async function handlePlayerSettingsUpdate(netId: number, settingsRaw: string) {
  const connectedPlayer = playerState.getConnectedPlayer(netId);
  const playerName = playerUtils.getPlayerNameFromNetId(netId);

  if (undefined === connectedPlayer) {
    logger.error(
      `cannot update player settings of "${playerName}" (net id ${netId}): `
      + `no connect player found for given net id`
    );
    emitNet(
      EVENT_NAMES.MESSAGE.FROM.SERVER,
      netId,
      LOG_LEVELS.ERROR.priority,
      `could not update player settings: internal server error`
    );
    return;
  }

  const existingSettings = await playerSettingsRepo.findByPlayer(connectedPlayer.id);

  if (undefined === existingSettings) {
    logger.error(
      `cannot update player settings of "${playerName}" (net id ${netId}): `
      + `found no existing settings to update`
    );
    emitNet(
      EVENT_NAMES.MESSAGE.FROM.SERVER,
      netId,
      LOG_LEVELS.ERROR.priority,
      `could not update player settings: internal server error`
    );
    return;
  }

  const updatedSettings = await playerSettingsRepo.updateByPlayer({
    ...existingSettings,
    settings: settingsRaw
  }, existingSettings.player);

  if (undefined === updatedSettings) {
    logger.error(
      `cannot update player settings of "${playerName}" (net id ${netId}): `
      + `database update failed (returned update query entity undefined)`
    );
    emitNet(
      EVENT_NAMES.MESSAGE.FROM.SERVER,
      netId,
      LOG_LEVELS.ERROR.priority,
      `could not update player settings: internal server error`
    );
    return;
  }

  logger.info(`updated player settings of "${playerName}" (net id ${netId})`);
  emitNet(
    EVENT_NAMES.MESSAGE.FROM.SERVER,
    netId,
    LOG_LEVELS.INFO.priority,
    `updated player settings on server`
  );
}
