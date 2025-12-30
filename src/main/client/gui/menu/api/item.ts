import {ItemIconType} from "../../../../common/gui/menu/item-icon-type";
import {ItemRenderProps} from "../../../../common/gui/menu/item-render-props";
import logger from "../../../logging/logger";

/**
 * Describes a callback function passed to an item which will be executed when an item is pressed.
 *
 * This callback function provides the pressed item as a parameter and can be either synchronous or asynchronous.
 */
export type OnItemPressedCallback = ((item: Item) => Promise<void>) | ((item: Item) => void);

export default class Item {
  id: string;
  icon: ItemIconType;
  title: string;
  description: string | undefined;
  focused: boolean;
  disabled: boolean;
  onPressed?: OnItemPressedCallback;

  constructor(props: ItemConstructorProps) {
    this.id = props.id;
    this.icon = props.icon;
    this.title = props.title;
    this.description = props.description;
    this.focused = props.focused ?? false;
    this.disabled = props.disabled ?? false;
    this.onPressed = props.onPressed;
  }

  async press(): Promise<void> {
    logger.debug(`Pressed item "${this.id}"`);
    if (undefined !== this.onPressed) {
      await this.onPressed(this);
    }
  }

  renderProps(): ItemRenderProps {
    return {
      id: this.id,
      icon: this.icon,
      title: this.title,
      description: this.description,
      focused: this.focused,
      disabled: this.disabled
    } satisfies ItemRenderProps;
  }
}

export type ItemConstructorProps = {
  id: string;
  icon: ItemIconType;
  title: string;
  description?: string;
  focused?: boolean;
  disabled?: boolean;
  onPressed?: OnItemPressedCallback;
};


