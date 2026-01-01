import $ from 'jquery';
import initializeNuiMessageEventListener from "./on-nui-message";
import menu from "./menu/render";
import logger from "./logging/logger";
import breadcrumps from "./breadcrumps/render";
import toasts from "./toasts/render";
import hud from "./hud/render";

$(async () => {
  breadcrumps.loadRootNode();
  toasts.loadRootNode();
  menu.loadRootNode();
  hud.loadRootNode();
  await toasts.startRemovingExpiredToasts();


  initializeNuiMessageEventListener();

  logger.info(`txn NUI ready`);
});
