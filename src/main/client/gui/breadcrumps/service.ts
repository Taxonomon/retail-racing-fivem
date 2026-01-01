import breadcrumpsState from "./state";
import sendNuiMessage from "../send-nui-message";
import {BreadCrumpsProps} from "../../../common/gui/breadcrumps/breadcrumps-props";
import {NUI_MSG_IDS} from "../../../common/gui/nui-message";
import playerState from "../../player/state";

export default function startUpdatingBreadcrumps() {
  breadcrumpsState.update.start(() => {
    // ping might be undefined right at script start because server hasn't sent anything yet
    if (undefined !== playerState.pingMs) {
      sendNuiMessage({
        id: NUI_MSG_IDS.BREADCRUMPS,
        data: {
          pingMs: playerState.pingMs ?? Number.NaN,
          fps: 1 / GetFrameTime()
        } satisfies BreadCrumpsProps
      });
    }
  }, 100);
}
