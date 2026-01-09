import logger from "./logging/logger";
import {registerClientCallbackRequestEventListener} from "./callback/service";
import {registerImportJobCommand} from "./rockstar/job/import/service";
import {configureDatabaseConnection, startMonitoringDatabaseConnectionHealth} from "./database/service";
import {registerPlayerSettingsCallbacks} from "./player/settings/service";
import {kickAllPlayers, registerPlayerConnectionEventListeners} from "./player/connection/service";
import registerPlayerAuthorizationCallbacks from "./player/authorization/service";
import {startUpdatingPlayerPings} from "./player/service";
import {registerBlockedVehicleCallbacks} from "./vehicle/service";
import {register as registerTrackCallbacks} from "./track/callbacks";

export default function registerOnResourceStartListener() {
  on('onServerResourceStart', async (resource: string) => {
    if (resource === GetCurrentResourceName()) {
      await handleResourceStart();
    }
  });
}

async function handleResourceStart() {
  const startedAt = Date.now();

  // prevent illegal script state by kicking everyone
  kickAllPlayers('Restarted main server script');
  configureDatabaseConnection();

  registerEventListeners();
  registerCallbacks();
  registerCommands();
  startSubProcesses();

  logger.info(`txn client script started in ${(Date.now() - startedAt).toFixed(0)} ms`);
}

function registerEventListeners() {
  registerPlayerConnectionEventListeners();
  registerClientCallbackRequestEventListener();
}

function registerCallbacks() {
  registerPlayerAuthorizationCallbacks();
  registerPlayerSettingsCallbacks();
  registerBlockedVehicleCallbacks();
  registerTrackCallbacks();
}

function registerCommands() {
  registerImportJobCommand();
}

function startSubProcesses() {
  startMonitoringDatabaseConnectionHealth();
  startUpdatingPlayerPings();
}
