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
import startHidingUnwantedNativeGuiHudElements from "./gui/native/hud";
import startTrackingPlayerSpeed from "./player/speed";
import startUpdatingGui from "./gui/hud/service";
import playerSettingsService from "./player/settings/service";
import hudService from "./gui/hud/service";
import initializeHudMenu from "./gui/hud/menu";
import initializePlayerSettingsMenu from "./player/settings/menu";
import initializeDefaultMenuItems from "./gui/menu/default-items";

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
  // TODO consider registering per-gamemode menus (freemode, hotlap, race, etc.)
  initializeMainMenu();
  initializeTimeMenu();
  initializeTrafficMenu();
  initializeWeatherMenu();
  initializePlayerSettingsMenu();
  initializeHudMenu();
  await initializeModerationMenu();
  await initializeAdministrationMenu();
  initializeDefaultMenuItems();

  // inputs
  menuInputService.setUp();
  controlActionService.startBlockingDisabledControlActions();
  inputBindingListener.start();

  // fetch & apply player settings
  await playerSettingsService.fetchAndApplyInitialSettings();

  // do other stuff
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
