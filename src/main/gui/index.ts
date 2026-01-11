import $ from 'jquery';
import initializeNuiMessageEventListener from "./on-nui-message";
import menu from "./menu/render";
import logger from "./logging/logger";
import breadcrumps from "./breadcrumps/render";
import toasts from "./toasts/render";
import {loadRootNode as loadHudRootNode} from "./hud/render";
import {loadLapTimerRootNode} from "./lap-timer/render";

$(async () => {
  breadcrumps.loadRootNode();
  toasts.loadRootNode();
  menu.loadRootNode();
  loadHudRootNode();
  loadLapTimerRootNode();
  await toasts.startRemovingExpiredToasts();

  initializeNuiMessageEventListener();

  logger.info(`txn NUI ready`);
});
