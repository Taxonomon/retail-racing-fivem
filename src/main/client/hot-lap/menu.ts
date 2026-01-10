import {addItemToMenu, addMenu, openMenu, removeAllItemsFromMenu, setMenuDisabled} from "../gui/menu/api/service";
import MENU_IDS from "../gui/menu/menu-ids";
import {MENU} from "./constants";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import Item from "../gui/menu/api/item";
import {GameMode} from "../../common/game-mode/game-mode";
import logger from "../logging/logger";
import {trackState} from "../track/state";
import {TrackFromServer} from "../../common/track/schemas";
import playSound from "../sound";
import toast from "../gui/toasts/service";
import {resetHotLap, setUpHotLap, stopHotLap} from "./service";
import {hotLapState} from "./state";

export function initialize() {
  addMenu({
    id: MENU_IDS.HOT_LAP.MAIN,
    title: 'Hot Lap',
    items: []
  });

  addItemToMenu(MENU_IDS.MAIN, {
    id: MENU.ITEM_IDS.HOT_LAP,
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
  trackState.trackList.forEach(track => {
    addItemToMenu(MENU_IDS.HOT_LAP.MAIN, {
      id: track.hash,
      title: track.name,
      description: `${track.name}<br><br>Author: ${track.author}`,
      icon: ItemIconType.NONE,
      onPressed: async () => await pressSetUpHotLapItem(track)
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
    onPressed: pressResetHotLapItem
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

  trackState.trackList.forEach(track => {
    addItemToMenu(MENU_IDS.HOT_LAP.TRACKS.MAIN, {
      id: track.hash,
      title: track.name,
      description: `${track.name}<br><br>Author: ${track.author}`,
      icon: ItemIconType.NONE,
      onPressed: async () => await pressSetUpHotLapItem(track)
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

function pressRespawnItemInHotLapMode() {
  // TODO impl
}

function pressStopItemInHotLapMode() {
  try {
    playSound.select();
    stopHotLap();
    toast.showInfo('Stopped hot lap');
  } catch (error: any) {
    logger.error(`Failed to stop current hot lap: ${error.message}`);
    toast.showError(`Failed to stop hot lap (see logs for details)`);
    playSound.error();
  }
}

async function pressResetHotLapItem() {
  try {
    playSound.select();
    resetHotLap();
    toast.showInfo(`Reset hot lap`);
  } catch (error: any) {
    logger.info(`Failed to reset hot lap: ${error.message}`);
    toast.showError(`Failed to reset hot lap (see logs for details)`);
    playSound.error();
  }
}

async function pressSetUpHotLapItem(track: TrackFromServer) {
  try {
    playSound.select();
    toast.showInfo(`Setting up hot lap on "${track.name}"...`);
    await setUpHotLap(track);
    toast.showInfo(`Started hot lap on "${track.name}"`);
    playSound.select();
  } catch (error: any) {
    logger.error(`Failed to start hot lap for track "${track.name}" (hash=${track.hash}): ${error.message}`);
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
