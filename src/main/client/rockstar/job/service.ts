import rockstarJobState from "./state";
import callbackService from "../../callback/outbound";
import CALLBACK_NAMES from "../../../common/callback/callback-names";
import logger from "../../logging/logger";
import {AvailableJob} from "../../../common/rockstar/available-job";
import toast from "../../gui/toasts/service";
import {closeAllMenus, setMenuDisabled} from "../../gui/menu/api/service";
import MENU_IDS from "../../gui/menu/menu-ids";
import {refreshHotLapMenuTracks} from "../../game-mode/hot-lap/menu";
import {refreshAdministrationMenuTracks} from "../../administration/menu";

export async function fetchAllRockstarJobs() {
  const callbackResult = await callbackService.triggerServerCallback(CALLBACK_NAMES.ROCKSTAR_JOB.FETCH_ALL);

  if (callbackResult.error) {
    logger.error(`Failed to fetch all R* jobs: callback returned an error: ${callbackResult.error}`);
    toast.showError(`Failed to fetch R* jobs from server (see logs for details)`);
    return;
  }

  rockstarJobState.availableJobs = callbackResult.data as AvailableJob[];
  logger.info(`Fetched ${rockstarJobState.availableJobs.length} R* jobs from server`);
  refreshJobMenus();
}

function refreshJobMenus() {
  // TODO notify client about this with a spinner, not a toast
  closeAllMenus();
  setMenuDisabled(MENU_IDS.MAIN, true);
  toast.showInfo('Refreshing job list, temporarily disabling menu...');

  refreshHotLapMenuTracks();
  refreshAdministrationMenuTracks();

  setMenuDisabled(MENU_IDS.MAIN, false);
  toast.showInfo('Refreshed job list');
}
