import {startBlockingDisabledControlActions} from "./input/control-action";
import inputBindingListener from "./input/binding/listener";
import logger from "./logging/logger";
import startUpdatingBreadcrumps from "./gui/breadcrumps/service";
import startReceivingPingUpdates from "./player/ping";
import registerMessageFromServerEventListener from "./logging/msg-from-server";
import startTrackingPlayerCoordinates from "./player/coordinates";
import wantedLevelService from "./wanted-level/menu";
import startHidingUnwantedNativeGuiHudElements from "./gui/native/hud";
import startTrackingPlayerSpeed from "./player/speed";
import {initializeMainMenu} from "./gui/menu/main-menu";
import {fetchAndApplyPlayerSettings, startSavingPlayerSettingsPeriodically} from "./player/settings/service";
import {initializeMenuInputBindings} from "./gui/menu/api/input";
import {startUpdatingHud} from "./gui/hud/service";
import {register as registerCallbackEventListeners} from "./callback/events";
import {register as registerHotlapEventListeners} from "./hot-lap/events";
import {updateTrackList} from "./track/service/tracklist";
import {switchGameModeTo} from "./player/game-mode";

export function registerOnClientResourceStartListener() {
  on('onClientResourceStart', async (resource: string) => {
    if (resource === GetCurrentResourceName()) {
      await handleOnClientResourceStart();
    }
  });
}

async function handleOnClientResourceStart() {
  const startedAt = GetGameTimer();

  initializeEventListeners();
  initializeInputs();
  await initializeSubProcesses();

  // other one-time process calls
  await initializeMainMenu();
  await fetchAndApplyPlayerSettings();
  await updateTrackList();
  wantedLevelService.disable();
  switchGameModeTo('FREE_MODE');

  logger.info(`txn client script started in ${GetGameTimer() - startedAt} ms`);
}

function initializeEventListeners() {
  registerMessageFromServerEventListener();
  registerCallbackEventListeners();
  registerHotlapEventListeners();
}

function initializeInputs() {
  initializeMenuInputBindings();
  startBlockingDisabledControlActions();
  inputBindingListener.start();
}

async function initializeSubProcesses() {
  await startSavingPlayerSettingsPeriodically();
  startReceivingPingUpdates();
  startUpdatingBreadcrumps();
  startUpdatingHud();
  startTrackingPlayerSpeed();
  startTrackingPlayerCoordinates();
  startHidingUnwantedNativeGuiHudElements();
}
