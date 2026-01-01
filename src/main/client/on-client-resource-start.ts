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

on('onClientResourceStart', async (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    // register event listeners
    // TODO refactor all other event listeners to follow the "register via function call" practice
    registerMessageFromServerEventListener();

    // menus
    initializeMainMenu();
    initializeTimeMenu();
    initializeTrafficMenu();
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

    // all done
    logger.info(`txn client script started`);
  }
});
