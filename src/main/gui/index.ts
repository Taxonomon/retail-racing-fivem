import $ from 'jquery';
import initializeNuiMessageEventListener from "./on-nui-message";
import menu from "./menu/render";
import logger from "./logging/logger";
import clock from "./clock/render";

$(() => {
  clock.initAndStart();
  menu.loadRootNode();
  initializeNuiMessageEventListener();
  logger.info(`txn NUI ready`);
});
