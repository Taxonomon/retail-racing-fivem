import sendNuiMessage from "../send-nui-message";
import {NUI_MSG_IDS} from "../../../common/gui/nui-message";
import {LapTimerRenderProps} from "../../../common/gui/lap-timer/props";

export function updateLapTimer(ms: number) {
  sendNuiMessage({
    id: NUI_MSG_IDS.LAP_TIMER,
    data: { lapTimeMs: ms } satisfies LapTimerRenderProps
  });
}

export function hideLapTimer() {
  sendNuiMessage({ id: NUI_MSG_IDS.LAP_TIMER });
}
