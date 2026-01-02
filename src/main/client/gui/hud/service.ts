import hudState from "./state";
import playerState from "../../player/state";
import sendNuiMessage from "../send-nui-message";
import {NUI_MSG_IDS} from "../../../common/gui/nui-message";
import {HudRenderProps} from "../../../common/gui/hud/render-props";
import {WALKING} from "../../../common/gui/hud/hud-type";
import playerSettingsService from "../../player/settings/service";
import PLAYER_SETTING_NAMES from "../../../common/player/setting-names";
import {UNITS} from "../../../common/unit/unit";
import unitConverter from "../../../common/unit/conversion";

function startUpdatingGui() {
  hudState.updateHud.start(() => {
    const speed = playerState.speed;
    if (undefined !== speed) {
      const displayUnit = getUnitToDisplay() ?? speed.unit;
      const displayValue = unitConverter.convert(speed.value, speed.unit, displayUnit);
      const displayPrecision = playerSettingsService.getNumberSetting(
        PLAYER_SETTING_NAMES.HUD.SPEED.PRECISION,
        1
      );

      sendNuiMessage({
        id: NUI_MSG_IDS.HUD,
        data: {
          type: WALKING,
          speed: {
            unit: displayUnit,
            value: displayValue,
            precision: displayPrecision
          }
        } satisfies HudRenderProps
      });
    }
  });
}

function getUnitToDisplay() {
  const setting = playerSettingsService.getStringSetting(PLAYER_SETTING_NAMES.HUD.SPEED.UNIT, '');
  return UNITS.find(u => u.symbol === setting);
}

const hudService = {
  startUpdatingGui
};

export default hudService;
