import $ from 'jquery';
import initializeNuiMessageEventListener from "./on-nui-message";
import menu from "./menu/render";
import logger from "./logging/logger";
import breadcrumps from "./breadcrumps/render";

$(() => {
  breadcrumps.loadRootNode();
  menu.loadRootNode();
  initializeNuiMessageEventListener();
  logger.info(`txn NUI ready`);
});
