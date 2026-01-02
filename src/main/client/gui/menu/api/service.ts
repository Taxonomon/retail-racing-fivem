import Menu, {MenuConstructorProps} from "./menu";
import menuState from "./state";
import sendNuiMessage from "../../send-nui-message";
import {NUI_MSG_IDS} from "../../../../common/gui/nui-message";
import playSound from "../../../sound";
import logger from "../../../logging/logger";
import Item, {ItemConstructorProps} from "./item";
import toast from "../../toasts/service";
import {ItemIconType} from "../../../../common/gui/menu/item-icon-type";
import menuInputService from "../input";

export type OpenMenuOptions = {
  withSound?: boolean;
};

export type AddItemToMenuProps = {
  before?: string;
  after?: string;
  first?: boolean;
};

function addMenu(props: MenuConstructorProps) {
  if (menuState.hasMenu(props.id)) {
    logger.warn(`cannot add menu "${props.id}": menu already exists`);
  }
  menuState.register.push(new Menu(props));
  logger.debug(`added menu "${props.id}"`);
}

function setMainMenu(id: string) {
  if (!menuState.hasMenu(id)) {
    logger.warn(`cannot set main menu "${id}": no such menu found`);
  }
  menuState.mainMenu = id;
  logger.debug(`set main menu to "${id}"`);
}

function removeMenu(id: string) {
  if (!menuState.hasMenu(id)) {
    logger.warn(`cannot remove menu "${id}": no such menu found`);
  } else if (menuState.isMenuRendered(id)) {
    logger.warn(`cannot remove menu "${id}": menu is currently rendered`);
  } else if (menuState.isMenuOpen(id)) {
    logger.warn(
      `cannot remove menu "${id}": menu is currently opened `
      + `(another menu may currently be rendered`
    );
  }

  const index = menuState.register.findIndex((menu) => menu.id === id);

  if (-1 === index) {
    // shouldn't happen because we already checked this earlier, but whatever
    logger.warn(`cannot remove menu "${id}": no such menu registered`);
  }

  menuState.register.splice(index, 1);
  logger.debug(`removed menu "${id}"`);

  if (menuState.mainMenu === id) {
    menuState.mainMenu = undefined;
    logger.debug(`removed main menu "${id}"`);
  }
}

function openMainMenu() {
  if (undefined === menuState.mainMenu) {
    const msg = `cannot open main menu: no main menu found`;
    logger.warn(msg);
    toast.showWarning(msg);
    playSound.error();
  } else if (menuState.isAnyMenuOpen()) {
    const msg = `cannot open main menu: menu is already open`;
    logger.warn(msg);
    toast.showWarning(msg);
    playSound.error();
  } else {
    openMenu(menuState.mainMenu);
  }
}

function openMenu(id: string, options?: OpenMenuOptions) {
  const menu = menuState.getMenu(id);
  const soundEnabled = undefined === options?.withSound || false !== options?.withSound;

  if (undefined === menu) {
    const msg = `cannot open menu "${id}": no such menu found`;
    logger.warn(msg);
    toast.showWarning(msg);
    if (soundEnabled) {
      playSound.error();
    }
    return;
  } else if (!menu.hasItems()) {
    const msg = `cannot open menu "${id}": menu has no items`;
    logger.warn(msg);
    toast.showWarning(msg);
    if (soundEnabled) {
      playSound.error();
    }
    return;
  }

  sendNuiMessage({
    id: NUI_MSG_IDS.MENU.RENDER,
    data: menu.renderProps()
  });

  // if no menu has been opened so far, toggle certain menu inputs while any menu is opened
  if (0 === menuState.stack.length) {
    menuInputService.disableMenuInputsBlockedWhileMenuIsOpened();
    menuInputService.enableMenuInputsNotBlockedWhileMenuIsOpened();
  }

  // if a child menu was closed, it was popped off the stack, leaving the parent menu on top of the stack.
  // now if this parent menu is trying to be opened, it shouldn't be added to the stack again if it's already
  // at the top of the stack.
  if (id !== menuState.stack.at(-1)) {
    menuState.stack.push(id);
  }

  // play sound unless options specifically say not to
  if (soundEnabled) {
    playSound.select();
  }
  logger.debug(`opened menu "${id}"`);
}

function closeCurrentMenu() {
  const currentMenuId = menuState.stack.at(-1);
  const parentMenuId = menuState.stack.at(-2);

  if (undefined === currentMenuId) {
    const msg = `cannot close current menu: menu isn't opened`;
    logger.warn(msg);
    toast.showWarning(msg);
    playSound.error();
    return;
  }

  sendNuiMessage({ id: NUI_MSG_IDS.MENU.CLEAR });
  menuState.stack.pop();
  playSound.back();
  logger.debug(`closed menu "${currentMenuId}"`);

  if (undefined !== parentMenuId) {
    openMenu(parentMenuId, { withSound: false });
  } else {
    menuState.mainMenuLastClosedAt = GetGameTimer();
    menuInputService.enableMenuInputsNotBlockedWhileMenuIsClosed();
    menuInputService.disableMenuInputsBlockedWhileMenuIsClosed();
  }
}

function closeAllMenus() {
  sendNuiMessage({ id: NUI_MSG_IDS.MENU.CLEAR });
  menuState.stack = [];
  menuState.mainMenuLastClosedAt = GetGameTimer();
  menuInputService.enableMenuInputsNotBlockedWhileMenuIsClosed();
  menuInputService.disableMenuInputsBlockedWhileMenuIsClosed();
  playSound.back();
  logger.debug(`closed all currently opened menus`);
}

function navigateToNextItem() {
  const menu = menuState.getRenderedMenu();

  if (undefined === menu) {
    const msg = `cannot navigate to next menu item: no menu is currently opened`;
    logger.warn(msg);
    toast.showWarning(msg);
    return;
  }

  menu.navigateToNextItem();
  refreshMenu();

  playSound.navigate();
  logger.debug(`navigated to next item in current menu`);
}

function navigateToPreviousItem() {
  const menu = menuState.getRenderedMenu();

  if (undefined === menu) {
    const msg = `cannot navigate to previous menu item: no menu is currently opened`;
    logger.warn(msg);
    toast.showWarning(msg);
    return;
  }

  menu.navigateToPreviousItem();
  refreshMenu();

  playSound.navigate();
  logger.debug(`navigated to previous item in current menu`);
}

async function pressFocusedItem() {
  const menu = menuState.getRenderedMenu();

  if (undefined === menu) {
    const msg = `cannot press focused menu item: no menu is currently opened`;
    logger.warn(msg);
    toast.showWarning(msg);
    return;
  }

  try {
    await menu.pressFocusedItem();
  } catch (error: any) {
    const msg = `failed to press focused menu item: ${error.message}`;
    logger.error(msg);
    toast.showError(msg);
    playSound.error();
  }
}

function addItemToMenu(menuId: string, item: ItemConstructorProps, options?: AddItemToMenuProps) {
  const menu = menuState.getMenu(menuId);

  if (undefined === menu) {
    logger.warn(`cannot add item "${item.id}" to menu "${menuId}": no such menu found`);
    return;
  }

  if (menu.hasItem(item.id)) {
    logger.warn(`cannot add item "${item.id}" to menu "${menuId}": item of same id already exists`);
    return;
  }

  let indexToInsert = -1;

  // if first is specified: insert item at the very beginning
  if (undefined !== options?.first && options.first) {
    indexToInsert = 0;
  } else if (undefined !== options?.before) {
    indexToInsert = menu.indexOfItem(options.before);
  } else if (undefined !== options?.after) {
    const afterIndex = menu.indexOfItem(options.after);
    indexToInsert = -1 === afterIndex ? -1 : afterIndex + 1;
  }

  indexToInsert = -1 === indexToInsert ? 0 : indexToInsert;
  menu.items.splice(indexToInsert, 0, new Item(item));
  logger.debug(
    `inserted item "${item.id}" at index ${indexToInsert}/${menu.items.length - 1} `
    + `of menu "${menuId}"`
  );
}

function removeItemFromMenu(menuId: string, itemId: string) {
  const menu = menuState.getMenu(menuId);

  if (undefined === menu) {
    logger.warn(`cannot remove item "${itemId}" to menu "${menuId}": no such menu found`);
    return;
  }

  const index = menu.indexOfItem(itemId);

  if (-1 === index) {
    logger.warn(`cannot remove item "${itemId}" to menu "${menuId}": no such item found in menu`);
    return;
  }

  menu.items.splice(index, 1);
  logger.debug(`removed item "${itemId}" from menu "${menuId}"`);
}

function setItemIcon(menuId: string, itemId: string, icon: ItemIconType) {
  const menu = menuState.getMenu(menuId);

  if (undefined === menu) {
    logger.warn(`cannot set icon of item "${itemId}": no such menu "${menuId}" found`);
    return;
  }

  const item = menu.getItem(itemId);

  if (undefined === item) {
    logger.warn(`cannot set icon of item "${itemId}": no such item found in menu "${menuId}"`);
    return;
  }

  item.icon = icon;
  logger.debug(`set icon of item "${itemId}" of menu "${menuId}" to "${icon}"`);
}

function refreshMenu() {
  const menu = menuState.getRenderedMenu();

  if (undefined === menu) {
    logger.warn(`cannot refresh menu: no menu is currently rendered`);
    return;
  }

  sendNuiMessage({
    id: NUI_MSG_IDS.MENU.RENDER,
    data: menu.renderProps()
  });
  logger.debug(`refreshed currently rendered menu`);
}

const menuService = {
  addMenu,
  setMainMenu,
  removeMenu,
  openMainMenu,
  openMenu,
  closeCurrentMenu,
  closeAllMenus,
  navigateToNextItem,
  navigateToPreviousItem,
  pressFocusedItem,
  addItemToMenu,
  removeItemFromMenu,
  setItemIcon,
  refreshMenu
};

export default menuService;
