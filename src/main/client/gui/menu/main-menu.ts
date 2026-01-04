import MENU_IDS from "./menu-ids";
import {ItemIconType} from "../../../common/gui/menu/item-icon-type";
import {initializeVehicleMenu} from "../../vehicle/menu";
import {initializePlayerSettingsMenu} from "../../player/settings/menu";
import playSound from "../../sound";
import toast from "../toasts/service";
import {wait} from "../../../common/wait";
import EVENT_NAMES from "../../../common/event-names";
import {initializeAdministrationMenu} from "../../administration/menu";
import {initializeModerationMenu} from "../../moderation/menu";
import {addMenu, setMainMenu} from "./api/service";

export async function initializeMainMenu() {
  addMenu({
    id: MENU_IDS.MAIN,
    title: 'Main Menu',
    items: [
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
        onPressed: pressKillYourselfItem
      },
      {
        id: 'disconnect',
        title: 'Disconnect',
        description: 'Disconnects you from the server.',
        icon: ItemIconType.NONE,
        onPressed: pressDisconnectItem
      }
    ]
  });

  setMainMenu(MENU_IDS.MAIN);

  // all below menus will add their items at the top of the menu successively,
  // on top of the above default items.
  await initializeAdministrationMenu();
  await initializeModerationMenu();
  initializePlayerSettingsMenu();
  await initializeVehicleMenu();
}

function pressKillYourselfItem() {
  SetEntityHealth(GetPlayerPed(-1), 0);
  playSound.select();
}

async function pressDisconnectItem() {
  playSound.select();
  toast.showInfo('Bye bye!');
  await wait(1000); // wait a little for the sound to finish playing
  emitNet(EVENT_NAMES.PLAYER.KICK.SELF, 'quit via menu');
}
