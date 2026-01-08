import {addItemToMenu, addMenu, openMenu, removeAllItemsFromMenu, setMenuDisabled} from "../../gui/menu/api/service";
import MENU_IDS from "../../gui/menu/menu-ids";
import rockstarJobState from "../../rockstar/job/state";
import {ItemIconType} from "../../../common/gui/menu/item-icon-type";
import {GameMode} from "../../../common/game-mode/game-mode";
import logger from "../../logging/logger";
import playSound from "../../sound";
import toast from "../../gui/toasts/service";
import Item from "../../gui/menu/api/item";
import {resetHotLap, startHotLap} from "./service";
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

  addMenu({
    id: MENU_IDS.HOT_LAP.TRACKS.MAIN,
    title: 'Tracks',
    items: []
  });
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
      onPressed: async () => await pressHotLapJobItemInFreeMode(job)
    });
  });
  setMenuDisabled(MENU_IDS.HOT_LAP.MAIN, false);
}

function loadHotLapMenuForHotLapMode() {
  removeAllItemsFromMenu(MENU_IDS.HOT_LAP.MAIN);
  removeAllItemsFromMenu(MENU_IDS.HOT_LAP.TRACKS.MAIN);

  addItemToMenu(MENU_IDS.HOT_LAP.MAIN, {
    id: 'reset',
    title: 'Reset',
    description: `Resets the hot lap and places you back at your hot lap's spawn point.`,
    icon: ItemIconType.NONE,
    onPressed: pressResetItemInHotLapMode
  });

  addItemToMenu(MENU_IDS.HOT_LAP.MAIN, {
    id: 'respawn',
    title: 'Respawn',
    description: 'Respawns you at the current checkpoint.',
    icon: ItemIconType.NONE,
    onPressed: pressRespawnItemInHotLapMode
  });

  addItemToMenu(MENU_IDS.HOT_LAP.MAIN, {
    id: 'tracks',
    title: 'Tracks',
    description: 'Select another track to hot lap.',
    icon: ItemIconType.NONE,
    onPressed: (item: Item) => openSubMenuFromItem(item, MENU_IDS.HOT_LAP.TRACKS.MAIN)
  });

  addItemToMenu(MENU_IDS.HOT_LAP.MAIN, {
    id: 'stop',
    title: 'Stop',
    description: 'Stops the current hot lap and returns you to free mode.',
    icon: ItemIconType.NONE,
    onPressed: pressStopItemInHotLapMode
  });

  rockstarJobState.availableJobs.forEach(job => {
    addItemToMenu(MENU_IDS.HOT_LAP.TRACKS.MAIN, {
      id: job.hash,
      title: job.name,
      description: `${job.name}<br><br>Author: ${job.author}`,
      icon: ItemIconType.NONE,
      onPressed: async () => await pressHotLapJobItemInHotLapMode(job)
    });
  });
}

function loadHotLapMenuForRaceMode() {
  const menuId = MENU_IDS.HOT_LAP.MAIN;
  setMenuDisabled(menuId, true);
}

function pressHotLapSubMenuItem(item: Item) {
  openSubMenuFromItem(item, MENU_IDS.HOT_LAP.MAIN);
}

async function pressHotLapJobItemInFreeMode(job: AvailableJob) {
  try {
    playSound.select();
    toast.showInfo(`Setting up hot lap session...`);
    await startHotLap(job.hash);
    toast.showInfo(`Started hot lap on "${job.name}"`);
    playSound.select();
  } catch (error: any) {
    logger.error(`Failed to start hot lap for track "${job.name}" (hash=${job.hash}): ${error.message}`);
    toast.showError(`Failed to start hot lap (see logs for details)`);
    playSound.error();
  }
}

async function pressResetItemInHotLapMode() {
  try {
    await resetHotLap();
    playSound.select();
  } catch (error: any) {
    logger.error(`Failed to reset current hot lap: ${error.message}`);
    toast.showError(`Failed to reset current hot lap (see logs for details)`);
    playSound.error();
  }
}

function pressRespawnItemInHotLapMode() {
  // TODO impl
}

function pressStopItemInHotLapMode() {
  // TODO impl
}

async function pressHotLapJobItemInHotLapMode(job: AvailableJob) {
  // TODO impl
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
