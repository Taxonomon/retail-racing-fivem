import databaseConnection from "./database/connection";
import databaseHealth from "./database/health";
import logger from "./logging/logger";
import registerAuthorizationCallbacks from "./authorization/callback";
import startUpdatingPlayerPings from "./player/ping";
import registerTrackImportCommand from "./track/import";

on('onResourceStart', async (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    // TODO kick all players with reason: main server script restarting
    
    // set up db
    databaseConnection.init();
    databaseHealth.startMonitor();

    // register server callbacks
    registerAuthorizationCallbacks();

    // register commands
    registerTrackImportCommand();

    // do other stuff
    startUpdatingPlayerPings();

    // all done
    logger.info(`txn server script started`);
  }
});
