import logger from "./logging/logger";
import {registerClientCallbackRequestListener} from "./callback/service";
import {registerImportJobCommand} from "./rockstar/job/import/service";
import {configureDatabaseConnection, startMonitoringDatabaseConnectionHealth} from "./database/service";
import {registerPlayerSettingsCallbacks} from "./player/settings/service";
import {kickAllPlayers, registerPlayerConnectionEventListeners} from "./player/connection/service";
import registerPlayerAuthorizationCallbacks from "./player/authorization/service";
import {startUpdatingPlayerPings} from "./player/service";
import {registerBlockedVehicleCallbacks} from "./vehicle/service";
import {registerRockstarJobCallbacks} from "./rockstar/job/service";

export default function registerOnResourceStartListener() {
  on('onServerResourceStart', async (resource: string) => {
    if (resource === GetCurrentResourceName()) {
      await handleResourceStart();
    }
  });
}

async function handleResourceStart() {
  // prevent illegal states by kicking all players on (re)start
  kickAllPlayers('Restarted main server script');

  // set up db
  configureDatabaseConnection();
  startMonitoringDatabaseConnectionHealth();

  // register event listeners
  registerPlayerConnectionEventListeners();
  registerClientCallbackRequestListener();

  // register callbacks
  registerPlayerAuthorizationCallbacks();
  registerPlayerSettingsCallbacks();
  registerBlockedVehicleCallbacks();
  registerRockstarJobCallbacks();

  // register commands
  registerImportJobCommand();

  // do other stuff
  startUpdatingPlayerPings();

  // all done
  logger.info(`txn server script started`);
}
