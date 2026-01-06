import Menu, {MenuConstructorProps} from "./menu";
import menuApiState from "./state";
import sendNuiMessage from "../../send-nui-message";
import {NUI_MSG_IDS} from "../../../../common/gui/nui-message";
import logger from "../../../logging/logger";
import Item, {ItemConstructorProps} from "./item";
import {ItemIconType} from "../../../../common/gui/menu/item-icon-type";
import {toggleMenuInputBindings} from "./input";

export type AddItemToMenuProps = {
  before?: string;
  after?: string;
  first?: boolean;
};

export function addMenu(props: MenuConstructorProps) {
  if (hasMenu(props.id)) {
    throw new Error(`menu "${props.id}" already exists`);
  }
  menuApiState.register.push(new Menu(props));
  logger.debug(`Added menu "${props.id}"`);
}

export function setMainMenu(menuId: string) {
  if (!hasMenu(menuId)) {
    throw noSuchMenuError(menuId);
  }
  menuApiState.mainMenu = menuId;
  logger.debug(`Set main menu to "${menuId}"`);
}

export function removeMenu(menuId: string) {
  if (isMenuCurrentlyRendered(menuId)) {
    throw new Error('menu is currently rendered');
  } else if (isMenuOpen(menuId)) {
    throw new Error('menu is currently opened (although another menu might currently be rendered)');
  }

  const index = menuApiState.register.findIndex((menu) => menu.id === menuId);

  if (-1 === index) {
    throw noSuchMenuError(menuId);
  }

  menuApiState.register.splice(index, 1);
  logger.debug(`Removed menu "${menuId}"`);

  if (menuApiState.mainMenu === menuId) {
    menuApiState.mainMenu = undefined;
    logger.debug(`Removed main menu "${menuId}"`);
  }
}

export function openMainMenu() {
  if (undefined === menuApiState.mainMenu) {
    throw new Error('no main menu found');
  } else if (isAnyMenuOpen()) {
    throw new Error('another menu is already open');
  }
  openMenu(menuApiState.mainMenu);
}

export function openMenu(menuId: string) {
  const menu = getMenu(menuId);

  if (menu.disabled) {
    throw new Error(`menu "${menuId}" is disabled`);
  } else if (menu.hidden) {
    throw new Error(`menu "${menuId}" is hidden`);
  } else if (!menu.hasItems()) {
    throw new Error(`menu "${menuId}" has no items`);
  }

  sendNuiMessage({
    id: NUI_MSG_IDS.MENU.RENDER,
    data: menu.renderProps()
  });

  const isMainMenuOpened = 0 === menuApiState.stack.length;

  // if a child menu was closed, it was popped off the stack, leaving the parent menu on top of the stack.
  // now if this parent menu is trying to be opened, it shouldn't be added to the stack again if it's already
  // at the top of the stack.
  if (menuId !== menuApiState.stack.at(-1)) {
    menuApiState.stack.push(menuId);
  }

  if (isMainMenuOpened) {
    toggleMenuInputBindings();
  }

  logger.debug(`Opened menu "${menuId}"`);
}

export function closeCurrentMenu() {
  const currentMenu = getCurrentlyRenderedMenu();
  menuApiState.stack.pop();
  logger.debug(`closed menu "${currentMenu.id}"`);

  const parentMenuId = menuApiState.stack.at(-1);

  if (undefined !== parentMenuId) {
    openMenu(parentMenuId);
  } else {
    sendNuiMessage({ id: NUI_MSG_IDS.MENU.CLEAR });
    menuApiState.mainMenuLastClosedAt = GetGameTimer();
    toggleMenuInputBindings();
  }
}

export function closeAllMenus() {
  sendNuiMessage({ id: NUI_MSG_IDS.MENU.CLEAR });
  menuApiState.stack = [];
  menuApiState.mainMenuLastClosedAt = GetGameTimer();
  toggleMenuInputBindings();
  logger.debug(`Closed all currently opened menus (including currently rendered menu)`);
}

export function navigateToNextItem() {
  getCurrentlyRenderedMenu().navigateToNextItem();
  refreshMenu();
  logger.debug(`Navigated to next item in currently rendered menu`);
}

export function navigateToPreviousItem() {
  getCurrentlyRenderedMenu().navigateToPreviousItem();
  refreshMenu();
  logger.debug(`Navigated to previous item in currently rendered menu`);
}

export async function pressCurrentlyFocusedMenuItem() {
  await getCurrentlyRenderedMenu().pressFocusedItem();
  logger.debug(`Pressed focused item in currently rendered menu`);
}

export function addItemToMenu(menuId: string, item: ItemConstructorProps, options?: AddItemToMenuProps) {
  const menu = getMenu(menuId);

  if (menu.hasItem(item.id)) {
    throw new Error(`item "${item.id}" already exists in menu "${menuId}"`);
  }

  let indexToInsert = -1;

  if (undefined !== options?.first && options.first) {
    indexToInsert = 0;
  } else if (undefined !== options?.before) {
    indexToInsert = menu.indexOfItem(options.before);
  } else if (undefined !== options?.after) {
    const afterIndex = menu.indexOfItem(options.after);
    indexToInsert = -1 === afterIndex ? -1 : afterIndex + 1;
  }

  const newItem = new Item(item);
  let insertedIndex;

  if (-1 === indexToInsert) {
    insertedIndex = menu.items.push(newItem);
  } else {
    menu.items.splice(indexToInsert, 0, new Item(item));
    insertedIndex = indexToInsert;
  }

  logger.debug(`Inserted item "${item.id}" at index ${insertedIndex} of menu "${menuId}"`);
}

export function removeItemFromMenu(menuId: string, itemId: string) {
  const menu = getMenu(menuId);
  const index = menu.indexOfItem(itemId);

  if (-1 === index) {
    throw noSuchItemInMenuError(menuId, itemId);
  }

  menu.items.splice(index, 1);
  logger.debug(`Removed item "${itemId}" from menu "${menuId}"`);
}

export function setMenuItemIcon(menuId: string, itemId: string, icon: ItemIconType) {
  getMenuItem(menuId, itemId).icon = icon;
  logger.debug(`Set icon of item "${itemId}" of menu "${menuId}" to "${icon}"`);
}

export function setMenuItemDisabled(menuId: string, itemId: string, disabled: boolean) {
  getMenuItem(menuId, itemId).disabled = disabled;
  logger.debug(`Set item "${itemId}" of menu "${menuId}" to disabled=${disabled}`);
}

export function refreshMenu() {
  sendNuiMessage({
    id: NUI_MSG_IDS.MENU.RENDER,
    data: getCurrentlyRenderedMenu().renderProps()
  });
  logger.debug(`Refreshed currently rendered menu`);
}

export function removeAllItemsFromMenu(menuId: string) {
  if (isMenuCurrentlyRendered(menuId)) {
    throw new Error('menu is currently being rendered');
  }

  getMenu(menuId).items = [];
  logger.debug(`Removed all items from menu "${menuId}"`);
}

export function getMenu(menuId: string) {
  const menu = menuApiState.register.find(menu => menu.id === menuId);

  if (undefined === menu) {
    throw noSuchMenuError(menuId);
  }

  return menu;
}

export function hasMenu(menuId: string) {
  return menuApiState.register.find(menu => menu.id === menuId);
}

export function getMenuItem(menuId: string, itemId: string) {
  const item = getMenu(menuId).items.find(item => item.id === itemId);

  if (undefined === item) {
    throw noSuchItemInMenuError(menuId, itemId);
  }

  return item;
}

export function isMenuOpen(menuId: string) {
  return menuApiState.stack.includes(menuId);
}

export function isMenuCurrentlyRendered(menuId: string) {
  return menuId === menuApiState.stack.at(-1);
}

export function getCurrentlyRenderedMenu() {
  const renderedMenuId = menuApiState.stack.at(-1);

  if (undefined === renderedMenuId) {
    throw new Error('no menu is currently being rendered');
  }

  const menu = menuApiState.register.find(menu => menu.id === renderedMenuId);

  if (undefined === menu) {
    throw noSuchMenuError(renderedMenuId);
  }

  return menu;
}

export function isAnyMenuOpen() {
  return menuApiState.stack.length > 0;
}

export function setMenuHidden(menuId: string, hidden: boolean) {
  getMenu(menuId).hidden = hidden;
  logger.debug(`Set menu "${menuId}" to hidden=${hidden}`);
}

export function setMenuDisabled(menuId: string, disabled: boolean) {
  getMenu(menuId).disabled = disabled;
}

function noSuchMenuError(menuId: string) {
  return new Error(`no such menu found for id "${menuId}"`);
}

function noSuchItemInMenuError(menuId: string, itemId: string) {
  return new Error(`no such item found for id "${itemId}" in menu "${menuId}"`);
}
