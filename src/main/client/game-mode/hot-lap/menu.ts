import {addItemToMenu, addMenu, openMenu, removeAllItemsFromMenu, setMenuDisabled} from "../../gui/menu/api/service";
import MENU_IDS from "../../gui/menu/menu-ids";
import rockstarJobState from "../../rockstar/job/state";
import {ItemIconType} from "../../../common/gui/menu/item-icon-type";
import {GameMode} from "../../../common/game-mode/game-mode";
import logger from "../../logging/logger";
import playSound from "../../sound";
import toast from "../../gui/toasts/service";
import Item from "../../gui/menu/api/item";
import {startHotLap} from "./service";
import {AvailableJob} from "../../../common/rockstar/job/available-job";

const HOT_LAP_MENU_ITEM_IDS = {
  HOT_LAP: 'hot-lap'
};

export function initializeHotLapMenu() {
  addMenu({
    id: MENU_IDS.HOT_LAP.MAIN,
    title: 'Hot Lap',
    items: []
  });

  addItemToMenu(MENU_IDS.MAIN, {
    id: HOT_LAP_MENU_ITEM_IDS.HOT_LAP,
    title: 'Hot Lap',
    description: 'Run time trials on various R* tracks.',
    icon: ItemIconType.SUB_MENU,
    onPressed: (item: Item) => pressHotLapSubMenuItem(item)
  }, { first: true });
}

// the hot lap menu looks different depending on the client's game mode
//
// free mode:
// - simply a list of all tracks
//
// hot lap:
// - reset
// - respawn
// - set spawn checkpoint
//   - label with current
//   - input for number
//   - +1/-1 action items
// - (order the following the same as in settings menu):
// - weather
// - time
//   - set time of day (morning, noon, evening, midnight)
//   - set custom hour
//   - freeze time
// - traffic
//
// race:
// - disabled/removed -> player has to exit race and switch to free mode first

export function loadHotLapMenu(gameMode: GameMode) {
  switch (gameMode) {
    case "FREE_MODE": {
      loadHotLapMenuForFreeMode();
      break;
    }
    case "HOT_LAP": {
      loadHotLapMenuForHotLapMode();
      break;
    }
    case "RACE": {
      loadHotLapMenuForRaceMode();
      break;
    }
  }
  logger.debug(`Loaded hot lap menu for game mode "${gameMode}"`);
}

function loadHotLapMenuForFreeMode() {
  removeAllItemsFromMenu(MENU_IDS.HOT_LAP.MAIN);
  rockstarJobState.availableJobs.forEach(job => {
    addItemToMenu(MENU_IDS.HOT_LAP.MAIN, {
      id: job.hash,
      title: job.name,
      description: `${job.name}<br><br>Author: ${job.author}`,
      icon: ItemIconType.NONE,
      onPressed: () => pressHotLapJobItemInFreeMode(job)
    });
  });
  setMenuDisabled(MENU_IDS.HOT_LAP.MAIN, false);
}

function loadHotLapMenuForHotLapMode() {
  // TODO implement
}

function loadHotLapMenuForRaceMode() {
  const menuId = MENU_IDS.HOT_LAP.MAIN;
  setMenuDisabled(menuId, true);
}

function pressHotLapSubMenuItem(item: Item) {
  openSubMenuFromItem(item, MENU_IDS.HOT_LAP.MAIN);
}

function pressHotLapJobItemInFreeMode(job: AvailableJob) {
  try {
    startHotLap(job.hash);
    playSound.select();
  } catch (error: any) {
    logger.error(`Failed to start hot lap for track "${job.name}" (hash=${job.hash}): ${error.message}`);
    toast.showError(`Failed to start hot lap (see logs for details)`);
    playSound.error();
  }
}

function openSubMenuFromItem(item: Item, subMenuId: string) {
  try {
    openMenu(subMenuId);
    playSound.select();
  } catch (error: any) {
    logger.error(`Failed to open sub menu "${item.title}" (id="${subMenuId}"): ${error.message}`);
    toast.showError(`Failed to open sub menu "${item.title}" (see logs for details)`);
    playSound.error();
  }
}
