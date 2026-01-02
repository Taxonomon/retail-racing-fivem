import hudState from "./state";
import playerState from "../../player/state";
import sendNuiMessage from "../send-nui-message";
import {NUI_MSG_IDS} from "../../../common/gui/nui-message";
import {HudRenderProps} from "../../../common/gui/hud/render-props";
import {WALKING} from "../../../common/gui/hud/hud-type";
import playerSettingsService from "../../player/settings/service";
import PLAYER_SETTING_NAMES from "../../../common/player/setting-names";
import {KILOMETERS_PER_HOUR, METERS_PER_SECOND, MILES_PER_HOUR, Unit, UNITS} from "../../../common/unit/unit";
import unitConverter from "../../../common/unit/conversion";
import logger from "../../logging/logger";
import menuService from "../menu/api/service";
import MENU_IDS from "../menu/menu-ids";
import {ItemIconType} from "../../../common/gui/menu/item-icon-type";

export const SELECTABLE_HUD_SPEED_UNITS: Unit[] = [
  METERS_PER_SECOND,
  KILOMETERS_PER_HOUR,
  MILES_PER_HOUR
];

function startUpdatingGui() {
  hudState.updateHud.start(() => {
    const speed = playerState.speed;

    if (undefined !== speed) {
      const data: HudRenderProps = {
        type: WALKING,
        speed: {
          unit: hudState.unit,
          precision: hudState.precision,
          value: unitConverter.convert(speed.value, speed.unit, hudState.unit)
        }
      };
      sendNuiMessage({
        id: NUI_MSG_IDS.HUD,
        data
      });
    }
  });
}

function applyInitialSettings() {
  // get unit
  const setting = playerSettingsService.getStringSetting(PLAYER_SETTING_NAMES.HUD.SPEED.UNIT, '');
  const unit = UNITS.find(u => u.identifier === setting) ?? MILES_PER_HOUR;
  if (undefined !== unit) {
    hudState.unit = unit;
    menuService.setItemIcon(MENU_IDS.SETTINGS.HUD.SPEED_UNIT.MAIN, unit.identifier, ItemIconType.SELECTED);
    logger.debug(`set initial hud speed unit to "${hudState.unit.symbol}"`);
  }

  // get precision
  const precision = playerSettingsService.getNumberSetting(PLAYER_SETTING_NAMES.HUD.SPEED.PRECISION, -1);
  if (precision !== -1) {
    hudState.precision = precision;
    logger.debug(`set initial hud speed precision to "${hudState.precision}"`);
  }
}

async function setSpeedUnit(unitRaw?: string) {
  let unit: Unit | undefined;

  if (undefined !== unitRaw) {
    unit = SELECTABLE_HUD_SPEED_UNITS.find(u => u.identifier === unitRaw);
  }

  if (undefined === unit) {
    throw new Error(`invalid unit "${unitRaw}"`);
  }

  hudState.unit = unit;
  await playerSettingsService.updateSetting(PLAYER_SETTING_NAMES.HUD.SPEED.UNIT, unitRaw);
}

async function setSpeedPrecision(precisionRaw?: string) {
  const precision = Number(precisionRaw);

  if (undefined === precisionRaw || Number.isNaN(precision) || precision < 0 || precision > 3) {
    throw new Error(`invalid precision "${precisionRaw}"`);
  }

  hudState.precision = precision;
  await playerSettingsService.updateSetting(PLAYER_SETTING_NAMES.HUD.SPEED.PRECISION, precision);
}

const hudService = {
  applyInitialSettings,
  startUpdatingGui,
  setSpeedUnit,
  setSpeedPrecision
};

export default hudService;
