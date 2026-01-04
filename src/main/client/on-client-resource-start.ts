import menuInputService from "./gui/menu/input";
import {controlActionService} from "./input/control-action";
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
import hudService from "./gui/hud/service";
import {initializeMainMenu} from "./gui/menu/main-menu";
import {fetchAndApplyPlayerSettings} from "./player/settings/service";

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
  menuInputService.setUp();
  controlActionService.startBlockingDisabledControlActions();
  inputBindingListener.start();

  // do other stuff
  await initializeMainMenu();
  await fetchAndApplyPlayerSettings();
  startReceivingPingUpdates();
  startUpdatingBreadcrumps();
  hudService.startUpdatingGui();
  startTrackingPlayerSpeed();
  startTrackingPlayerCoordinates();
  startHidingUnwantedNativeGuiHudElements();
  wantedLevelService.disable();

  // all done
  logger.info(`txn client script started`);
}
