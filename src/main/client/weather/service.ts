import {SELECTABLE_WEATHER_TYPES, SNOW_TYPES, SUNNY, WeatherType} from "./weather-type";
import weatherState from "./state";
import logger from "../logging/logger";
import PLAYER_SETTING_NAMES from "../../common/player/setting-names";
import {wait, waitOneFrame} from "../../common/wait";
import {updateWeatherSelectionMenuItemIcons} from "./menu";
import toast from "../gui/toasts/service";
import {getStringPlayerSetting, updatePlayerSetting} from "../player/settings/service";

const SNOW_ASSETS = {
  CORE_SNOW: 'core_snow',
  ICE_FOOTSTEPS: 'ICE_FOOTSTEPS',
  SNOW_FOOTSTEPS: 'SNOW_FOOTSTEPS'
};

export async function applyWeatherPlayerSettings() {
  const weatherTypeId = getStringPlayerSetting(PLAYER_SETTING_NAMES.WEATHER, '');
  const weatherType = SELECTABLE_WEATHER_TYPES.find(wt => wt.id === weatherTypeId) ?? SUNNY;

  logger.debug(`Will apply initial weather type "${weatherType.label}" taken from player settings`);

  // for whatever reason we need to wait a little to let the client load in, else the weather
  // doesn't really get applied (at least it looks different if you re-apply the same weather
  // via the menu right after)
  await wait(1000);
  await setPermanentWeatherByWeatherTypeId(weatherType.id);

  toast.showInfo(`Set weather to "${weatherType.label}"`);
  updateWeatherSelectionMenuItemIcons(weatherType.id);
}

export async function setPermanentWeatherByWeatherTypeId(weatherTypeId: string) {
  const weatherType = SELECTABLE_WEATHER_TYPES.find(wt => wt.id === weatherTypeId);

  if (undefined === weatherType) {
    throw new Error(`invalid weather type "${weatherTypeId}"`);
  }

  await setPermanentWeatherByWeatherType(weatherType);
}

export async function setPermanentWeatherByWeatherType(weatherType: WeatherType) {
  SetWeatherTypeNowPersist(weatherType.id);
  await toggleSnowProperties(isSnowType(weatherType));
  updatePlayerSetting(PLAYER_SETTING_NAMES.WEATHER, weatherType.id);
  logger.info(`Set permanent weather to "${weatherType.id}"`);
}

function isSnowType(weatherType: WeatherType) {
  return SNOW_TYPES.some((type) => type.id === weatherType.id);
}

async function toggleSnowProperties(toggle: boolean) {
  // snow assets only ever need to be loaded once
  if (!weatherState.areSnowAssetsLoaded) {
    await loadSnowAssets();
  }
  SetForcePedFootstepsTracks(toggle);
  SetForceVehicleTrails(toggle);
  ForceSnowPass(toggle);
}

async function loadSnowAssets() {
  RequestScriptAudioBank(SNOW_ASSETS.SNOW_FOOTSTEPS, false);
  RequestScriptAudioBank(SNOW_ASSETS.ICE_FOOTSTEPS, false);
  RequestNamedPtfxAsset(SNOW_ASSETS.CORE_SNOW);

  while(!HasNamedPtfxAssetLoaded(SNOW_ASSETS.CORE_SNOW)) {
    await waitOneFrame();
  }

  UseParticleFxAsset(SNOW_ASSETS.CORE_SNOW);
}
