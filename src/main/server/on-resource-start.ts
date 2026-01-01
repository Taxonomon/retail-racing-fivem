import databaseConnection from "./database/connection";
import databaseHealth from "./database/health";
import logger from "./logging/logger";
import registerAuthorizationCallbacks from "./authorization/callback";
import startUpdatingPlayerPings from "./player/ping";
import registerTrackImportCommand from "./track/import";
import registerOnPlayerJoinListener from "./player/connection/join";
import registerOnPlayerConnectingListener from "./player/connection/connect";
import registerClientCallbackRequestListener from "./callback/inbound";
import registerOnPlayerDroppedListener from "./player/connection/drop";
import kickPlayerSerice from "./player/kick";

export default function registerOnResourceStartListener() {
  on('onServerResourceStart', async (resource: string) => {
    if (resource === GetCurrentResourceName()) {
      await handleResourceStart();
    }
  });
}

async function handleResourceStart() {
  // prevent illegal states by kicking all players on (re)start
  kickPlayerSerice.kickAllPlayers('main server script restarting');

  // set up db
  databaseConnection.init();
  databaseHealth.startMonitor();

  // register server listeners
  registerOnPlayerConnectingListener();
  registerOnPlayerJoinListener();
  registerOnPlayerDroppedListener()
  kickPlayerSerice.registerPlayerSelfKickListener();
  registerClientCallbackRequestListener();

  // register server callbacks
  registerAuthorizationCallbacks();

  // register commands
  registerTrackImportCommand();

  // do other stuff
  startUpdatingPlayerPings();

  // all done
  logger.info(`txn server script started`);
}
