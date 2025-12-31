import $ from 'jquery';
import initializeNuiMessageEventListener from "./on-nui-message";
import menu from "./menu/render";
import logger from "./logging/logger";
import breadcrumps from "./breadcrumps/render";
import toasts from "./toasts/render";

$(async () => {
  breadcrumps.loadRootNode();
  toasts.loadRootNode();
  await toasts.startRemovingExpiredToasts();
  menu.loadRootNode();
  initializeNuiMessageEventListener();
  logger.info(`txn NUI ready`);
});
