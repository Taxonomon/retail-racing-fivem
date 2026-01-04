import Item, {ItemConstructorProps} from "./item";
import {MenuRenderProps} from "../../../../common/gui/menu/menu-render-props";

export default class Menu {
  private static readonly DISPLAYABLE_ITEMS_MAX = 11;

  id: string;
  title: string;
  items: Item[];

  constructor(props: MenuConstructorProps) {
    this.id = props.id;
    this.title = props.title;
    this.items = props.items.map((itemProps) => new Item(itemProps));
  }

  renderProps(): MenuRenderProps {
    return {
      id: this.id,
      title: this.title,
      items: this.displayableItems().map((item) => item.renderProps()),
      focusedItemIndex: this.items.findIndex((item) => item.focused) + 1,
      numberOfTotalItems: this.items.length
    } satisfies MenuRenderProps;
  }

  async pressFocusedItem() {
    const focusedItem = this.items.find((item) => item.focused);

    if (undefined === focusedItem) {
      throw new Error(`no focused item`);
    }

    await focusedItem.press();
  }

  navigateToNextItem() {
    const focusedItemIndex = this.items.findIndex((item) => item.focused);
    if (undefined === focusedItemIndex || focusedItemIndex === this.items.length - 1) {
      this.focusItemAtIndex(0);
    } else {
      let nextIndex = focusedItemIndex + 1;
      while (undefined === this.items[nextIndex] || this.items[nextIndex].disabled) {
        if (nextIndex >= this.items.length) {
          nextIndex = 0;
        } else {
          nextIndex += 1;
        }
      }
      this.focusItemAtIndex(nextIndex);
    }
  }

  navigateToPreviousItem() {
    const focusedItemIndex = this.items.findIndex((item) => item.focused);
    if (undefined === focusedItemIndex) {
      this.focusItemAtIndex(0);
    } else {
      let previousIndex = focusedItemIndex - 1;
      while (undefined === this.items[previousIndex] || this.items[previousIndex].disabled) {
        if (previousIndex <= 0) {
          previousIndex = this.items.length - 1;
        } else {
          previousIndex -= 1;
        }
      }
      this.focusItemAtIndex(previousIndex);
    }
  }

  focusItemAtIndex(index: number) {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].focused = i === index;
    }
  }

  displayableItems() {
    if (0 === this.items.length || -1 === this.items.findIndex(i => !i.disabled)) {
      throw new Error('no displayable items');
    }

    let focusedItemIndex = this.items.findIndex((item) => item.focused);

    if (-1 === focusedItemIndex) {
      this.focusItemAtIndex(0);
      focusedItemIndex = 0;
    }

    if (this.items.length <= Menu.DISPLAYABLE_ITEMS_MAX) {
      return this.items;
    }

    const perSide = Math.floor(Menu.DISPLAYABLE_ITEMS_MAX / 2);

    let min = focusedItemIndex - perSide;
    let max = focusedItemIndex + perSide;

    while (min < 0) {
      min++;
      max++;
    }

    while (max > this.items.length - 1) {
      min--;
      max--;
    }

    return this.items.slice(min, max + 1);
  }

  hasItems() {
    return this.items.length > 0;
  }

  hasItem(id: string) {
    return this.items.some(item => item.id === id);
  }

  indexOfItem(id: string) {
    return this.items.findIndex(item => item.id === id);
  }

  getItem(itemId: string) {
    return this.items.find(item => item.id === itemId);
  }
}

export type MenuConstructorProps = {
  id: string;
  title: string;
  items: ItemConstructorProps[];
};
