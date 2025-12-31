import menuService from "./api/service";
import MENU_IDS from "./menu-ids";
import {ItemIconType} from "../../../common/gui/menu/item-icon-type";
import EVENT_NAMES from "../../../common/event-names";
import wait from "../../../common/wait";
import playSound from "../../sound";
import toast from "../toasts/service";

function initialize() {
  menuService.addMenu({
    id: MENU_IDS.MAIN,
    title: 'Main Menu',
    // other features will add their items separately
    // the ones below are common default items
    items: [
      {
        id: 'about',
        title: 'About',
        description: 'txn menu v1.0.0 by Taxonomon',
        icon: ItemIconType.LABEL
      },
      {
        id: 'disconnect',
        title: 'Disconnect',
        description: 'Disconnects you from the server.',
        icon: ItemIconType.ACTION,
        onPressed: async () => {
          playSound.select();
          toast.showInfo('Bye bye!');
          await wait.millis(1000); // wait a little for the sound to finish playing
          emitNet(EVENT_NAMES.PLAYER.KICK.SELF, 'quit via menu')
        }
      }
    ],
  });
  menuService.setMainMenu(MENU_IDS.MAIN);
}


const mainMenu = { initialize };

export default mainMenu;
