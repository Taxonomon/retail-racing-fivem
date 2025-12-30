import menuInput from "./gui/menu/input";
import {controlActionService} from "./input/control-action";
import inputBindingListener from "./input/binding/listener";
import logger from "./logging/logger";
import mainMenu from "./gui/menu/main-menu";
import moderationMenu from "./moderation/menu";
import administrationMenu from "./administration/menu";
import startUpdatingBreadcrumps from "./gui/breadcrumps/service";
import startReceivingPingUpdates from "./player/ping";

on('onClientResourceStart', async (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    startReceivingPingUpdates();
    startUpdatingBreadcrumps();

    // menus
    mainMenu.initialize();
    await moderationMenu.initialize();
    await administrationMenu.initialize();

    // inputs
    menuInput.setUp();
    controlActionService.startBlockingDisabledControlActions();
    inputBindingListener.start();

    // all done
    logger.info(`txn client script started`);
  }
});
