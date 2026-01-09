import hudState from "./state";
import {playerState} from "../../player/state";
import sendNuiMessage from "../send-nui-message";
import {NUI_MSG_IDS} from "../../../common/gui/nui-message";
import {HudRenderProps} from "../../../common/gui/hud/render-props";
import {WALKING} from "../../../common/gui/hud/hud-type";
import PLAYER_SETTING_NAMES from "../../../common/player/setting-names";
import {KILOMETERS_PER_HOUR, METERS_PER_SECOND, MILES_PER_HOUR, Unit, UNITS} from "../../../common/unit/unit";
import unitConverter from "../../../common/unit/conversion";
import logger from "../../logging/logger";
import {getNumberPlayerSetting, getStringPlayerSetting, updatePlayerSetting} from "../../player/settings/service";
import {updateHudSpeedUnitMenuItemIcons} from "./menu";

export const HUD_SPEED_PRECISION = {
  MIN: 0,
  MAX: 3
};

export const SELECTABLE_HUD_SPEED_UNITS: Unit[] = [
  METERS_PER_SECOND,
  KILOMETERS_PER_HOUR,
  MILES_PER_HOUR
];

export function startUpdatingHud() {
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
      sendNuiMessage({ id: NUI_MSG_IDS.HUD, data });
    }
  });
}

export function applyHudPlayerSettings() {
  // get unit
  const setting = getStringPlayerSetting(PLAYER_SETTING_NAMES.HUD.SPEED.UNIT, '');
  const unit = UNITS.find(u => u.identifier === setting) ?? MILES_PER_HOUR;
  if (undefined !== unit) {
    hudState.unit = unit;
    updateHudSpeedUnitMenuItemIcons(unit.identifier);
    logger.debug(`Set initial HUD speed unit to "${hudState.unit.label}"`);
  }

  // get precision
  const precision = getNumberPlayerSetting(PLAYER_SETTING_NAMES.HUD.SPEED.PRECISION, -1);
  if (precision !== -1) {
    hudState.precision = precision;
    logger.debug(`Set initial HUD speed precision to ${hudState.precision} decimals`);
  }
}

export function setHudSpeedUnit(unitRaw?: string) {
  let unit: Unit | undefined;

  if (undefined !== unitRaw) {
    unit = SELECTABLE_HUD_SPEED_UNITS.find(u => u.identifier === unitRaw);
  }

  if (undefined === unit) {
    throw new Error(`invalid unit "${unitRaw}"`);
  }

  hudState.unit = unit;
  updatePlayerSetting(PLAYER_SETTING_NAMES.HUD.SPEED.UNIT, unitRaw);
  logger.info(`Set HUD speed unit to "${unit.label}"`);
}

export function setHudSpeedPrecision(precisionRaw?: string) {
  const precision = Number(precisionRaw);

  if (undefined === precisionRaw
    || Number.isNaN(precision)
    || precision < HUD_SPEED_PRECISION.MIN
    || precision > HUD_SPEED_PRECISION.MAX
  ) {
    throw new Error(`invalid precision "${precisionRaw}"`);
  }

  hudState.precision = precision;
  updatePlayerSetting(PLAYER_SETTING_NAMES.HUD.SPEED.PRECISION, precision);
  logger.info(`Set HUD speed precision to ${precision} decimals`);
}
