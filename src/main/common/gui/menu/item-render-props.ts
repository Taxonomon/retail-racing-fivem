import {ItemIconType} from "./item-icon-type";

export type ItemRenderProps = {
  id: string;
  icon: ItemIconType;
  title: string;
  description: string | undefined;
  focused: boolean;
  disabled: boolean;
}
