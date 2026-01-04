import {startBlockingDisabledControlActions} from "./input/control-action";
import inputBindingListener from "./input/binding/listener";
import logger from "./logging/logger";
import startUpdatingBreadcrumps from "./gui/breadcrumps/service";
import startReceivingPingUpdates from "./player/ping";
import registerMessageFromServerEventListener from "./logging/msg-from-server";
import startTrackingPlayerCoordinates from "./player/coords";
import wantedLevelService from "./wanted-level/menu";
import callbackService from "./callback/outbound";
import startHidingUnwantedNativeGuiHudElements from "./gui/native/hud";
import startTrackingPlayerSpeed from "./player/speed";
import {initializeMainMenu} from "./gui/menu/main-menu";
import {fetchAndApplyPlayerSettings, startSavingPlayerSettingsPeriodically} from "./player/settings/service";
import {initializeMenuInputBindings} from "./gui/menu/api/input";
import {startUpdatingHud} from "./gui/hud/service";

export default function registerOnClientResourceStartListener() {
  on('onClientResourceStart', async (resource: string) => {
    if (resource === GetCurrentResourceName()) {
      await handleOnClientResourceStart();
    }
  });
}

async function handleOnClientResourceStart() {
  // register event listeners
  callbackService.registerServerCallbackResponseListener();
  registerMessageFromServerEventListener();

  // inputs
  startBlockingDisabledControlActions();
  inputBindingListener.start();

  // set up menu
  await initializeMainMenu();
  initializeMenuInputBindings();

  // player settings
  await fetchAndApplyPlayerSettings();
  await startSavingPlayerSettingsPeriodically();

  // do other stuff
  startReceivingPingUpdates();
  startUpdatingBreadcrumps();
  startUpdatingHud();
  startTrackingPlayerSpeed();
  startTrackingPlayerCoordinates();
  startHidingUnwantedNativeGuiHudElements();
  wantedLevelService.disable();

  // all done
  logger.info(`txn client script started`);
}
