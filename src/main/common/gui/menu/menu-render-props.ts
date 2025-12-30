import {ItemRenderProps} from "./item-render-props";

export type MenuRenderProps = {
  id: string;
  title: string;
  items: ItemRenderProps[];
  focusedItemIndex: number;
  numberOfTotalItems: number;
};
