import $ from 'jquery';
import menuState from "./state";
import logger from "../logging/logger";
import {MenuRenderProps} from "../../common/gui/menu/menu-render-props";
import {ItemRenderProps} from "../../common/gui/menu/item-render-props";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import ICONS from "../icons";

const CLASSES = {
  MENU: 'menu',
  ITEM: 'item',
  HEADER: 'header',
  TEXT: 'text',
  COUNTER: 'counter',
  SEPARATOR: 'separator',
  DESCRIPTION: 'description',
  ICON: 'icon',
  FOCUSED: 'focused',
  ITEMS: 'items',
  DISABLED: 'disabled',
  MATERIAL_SYMBOLS_OUTLINED: 'material-symbols-outlined'
};

function loadRootNode() {
  menuState.rootNode = $(`.${CLASSES.MENU}`);
}

function clear() {
  menuState.getRootNode().empty();
  logger.debug(`cleared menu`);
}

function render(props: MenuRenderProps) {
  menuState.getRootNode().empty().html(menuHtml(props));
}

function menuHtml(props: MenuRenderProps) {
  return `
    ${imageHtml()}
    ${itemsHtml(props)}
  `;
}

function imageHtml() {
  // TODO add image display
  return `<div class="image"></div>`;
}

function itemsHtml(props: MenuRenderProps) {
  const items: string[] = [];
  let description: string | undefined;

  for (const itemProps of props.items) {
    items.push(itemHtml(itemProps));
    if (itemProps.focused) {
      description = itemProps.description;
    }
  }

  return `
    <div class="${CLASSES.ITEMS}">
      ${headerHtml(props.title, props.focusedItemIndex, props.numberOfTotalItems)}
      ${separatorHtml()}
      ${items.join('')}
      ${undefined === description ? '' : descriptionHtml(description)}
    </div>
  `;
}

function headerHtml(title: string, focusedItemIndex: number, numberOfTotalItems: number) {
  return `
    <div class="${CLASSES.ITEM} ${CLASSES.HEADER}">
      <div class="${CLASSES.TEXT}">${title}</div>
      <div class="${CLASSES.COUNTER}">${focusedItemIndex} / ${numberOfTotalItems}</div>
    </div>
  `;
}

function separatorHtml() {
  return `<div class="${CLASSES.SEPARATOR}"></div>`;
}

function descriptionHtml(description: string) {
  return `
    <div class="${CLASSES.SEPARATOR}"></div>
    <div class="${CLASSES.DESCRIPTION}">${description}</div>
  `;
}

function itemHtml(props: ItemRenderProps) {
  return `
    <div class="${CLASSES.ITEM} ${props.focused ? CLASSES.FOCUSED : ''} ${props.disabled ? CLASSES.DISABLED : ''}">
      <div class="${CLASSES.TEXT}">${props.title}</div>
      <span class="${CLASSES.ICON} ${CLASSES.MATERIAL_SYMBOLS_OUTLINED}">${getIconFromIconType(props.icon)}</span>
    </div>
  `;
}

function getIconFromIconType(itemIconType: ItemIconType) {
  switch (itemIconType) {
    case ItemIconType.SUB_MENU: return ICONS.KEYBOARD_DOUBLE_ARROW_RIGHT;
    case ItemIconType.LABEL: return ICONS.INFO;
    case ItemIconType.TOGGLE_ON: return ICONS.CHECK_BOX;
    case ItemIconType.TOGGLE_OFF: return ICONS.CHECK_BOX_OUTLINE_BLANK;
    case ItemIconType.SELECTED: return ICONS.CHECK;
    case ItemIconType.INPUT: return ICONS.BORDER_COLOR;
    default: return '';
  }
}

const menu = {
  loadRootNode,
  clear,
  render
};

export default menu;
