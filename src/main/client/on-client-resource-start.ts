import menuInputService from "./gui/menu/input";
import {controlActionService} from "./input/control-action";
import inputBindingListener from "./input/binding/listener";
import logger from "./logging/logger";
import startUpdatingBreadcrumps from "./gui/breadcrumps/service";
import startReceivingPingUpdates from "./player/ping";
import registerMessageFromServerEventListener from "./logging/msg-from-server";
import startTrackingPlayerCoordinates from "./player/coords";
import initializeModerationMenu from "./moderation/menu";
import initializeMainMenu from "./gui/menu/main-menu";
import initializeAdministrationMenu from "./administration/menu";
import initializeTrafficMenu from "./traffic/menu";
import initializeTimeMenu from "./time/menu";
import wantedLevelService from "./wanted-level/menu";
import initializeWeatherMenu from "./weather/menu";
import callbackService from "./callback/outbound";

export default function registerOnClientResourceStartListener() {
  on('onClientResourceStart', async (resource: string) => {
    if (resource === GetCurrentResourceName()) {
      await handleOnClientResourceStart();
    }
  });
}

async function handleOnClientResourceStart() {
  // register event listeners
  // TODO refactor all other event listeners to follow the "register via function call" practice
  callbackService.registerServerCallbackResponseListener();
  registerMessageFromServerEventListener();

  // menus
  initializeMainMenu();
  initializeTimeMenu();
  initializeTrafficMenu();
  initializeWeatherMenu();
  await initializeModerationMenu();
  await initializeAdministrationMenu();

  // inputs
  menuInputService.setUp();
  controlActionService.startBlockingDisabledControlActions();
  inputBindingListener.start();

  // start doing other stuff
  startReceivingPingUpdates();
  startUpdatingBreadcrumps();
  startTrackingPlayerCoordinates();
  wantedLevelService.disable();

  // all done
  logger.info(`txn client script started`);
}
