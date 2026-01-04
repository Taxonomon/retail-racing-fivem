import {ItemConstructorProps} from "./api/item";
import {ItemIconType} from "../../../common/gui/menu/item-icon-type";
import playSound from "../../sound";
import toast from "../toasts/service";
import EVENT_NAMES from "../../../common/event-names";
import menuService from "./api/service";
import MENU_IDS from "./menu-ids";
import {wait} from "../../../common/wait";

export default function initializeDefaultMenuItems() {
  const items: ItemConstructorProps[] = [
    {
      id: 'about',
      title: 'About',
      description: 'txn menu v1.0.0 by Taxonomon',
      icon: ItemIconType.LABEL
    },
    {
      id: 'kill-yourself',
      title: 'Kill Yourself',
      description: `A replica of Retail GTA's "The Easy Way Out".`,
      icon: ItemIconType.NONE,
      onPressed: () => {
        SetEntityHealth(GetPlayerPed(-1), 0);
        playSound.select();
      }
    },
    {
      id: 'disconnect',
      title: 'Disconnect',
      description: 'Disconnects you from the server.',
      icon: ItemIconType.NONE,
      onPressed: async () => {
        playSound.select();
        toast.showInfo('Bye bye!');
        await wait(1000); // wait a little for the sound to finish playing
        emitNet(EVENT_NAMES.PLAYER.KICK.SELF, 'quit via menu')
      }
    }
  ];
  items.forEach(item => menuService.addItemToMenu(MENU_IDS.MAIN, item));
}
