import hudState from "./state";
import playerState from "../../player/state";
import sendNuiMessage from "../send-nui-message";
import {NUI_MSG_IDS} from "../../../common/gui/nui-message";
import {HudRenderProps} from "../../../common/gui/hud/render-props";
import {HudType} from "../../../common/gui/hud/hud-type";

export default function startUpdatingHud() {
  hudState.updateHud.start(() => {
    const speed = playerState.speed;
    if (undefined !== speed) {
      // TODO alter HudType & HUD render props send to GUI based on vehicle type
      sendNuiMessage({
        id: NUI_MSG_IDS.HUD,
        data: {
          type: HudType.WALKING,
          speed: {
            ...speed,
            precision: 1 // TODO allow client to change precision via menu
          }
        } satisfies HudRenderProps
      });
    }
  });
}
