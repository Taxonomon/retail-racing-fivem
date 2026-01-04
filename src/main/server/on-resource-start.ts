import databaseConnection from "./database/connection";
import databaseHealth from "./database/health";
import logger from "./logging/logger";
import registerAuthorizationCallbacks from "./authorization/callback";
import startUpdatingPlayerPings from "./player/ping";
import registerTrackImportCommand from "./track/service";
import registerOnPlayerJoinListener from "./player/connection/join";
import registerOnPlayerConnectingListener from "./player/connection/connect";
import registerOnPlayerDroppedListener from "./player/connection/drop";
import registerPlayerSettingsCallbacks from "./player/settings/callback";
import kickPlayerService from "./player/kick";
import callbackService from "./callback/inbound";
import blockedVehicleService from "./vehicle/blocked/service";

export default function registerOnResourceStartListener() {
  on('onServerResourceStart', async (resource: string) => {
    if (resource === GetCurrentResourceName()) {
      await handleResourceStart();
    }
  });
}

async function handleResourceStart() {
  // prevent illegal states by kicking all players on (re)start
  kickPlayerService.kickAllPlayers('main server script restarting');

  // set up db
  databaseConnection.init();
  databaseHealth.startMonitor();

  // register server listeners
  registerOnPlayerConnectingListener();
  registerOnPlayerJoinListener();
  registerOnPlayerDroppedListener();
  kickPlayerService.registerPlayerSelfKickListener();
  callbackService.registerClientCallbackRequestListener();

  // register server callbacks
  registerAuthorizationCallbacks();
  registerPlayerSettingsCallbacks();
  blockedVehicleService.registerCallbacks();

  // register commands
  registerTrackImportCommand();

  // do other stuff
  startUpdatingPlayerPings();

  // all done
  logger.info(`txn server script started`);
}
