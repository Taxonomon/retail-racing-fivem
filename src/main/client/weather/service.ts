import {SELECTABLE_WEATHER_TYPES, SNOW_TYPES, SUNNY, WeatherType} from "./weather-type";
import weatherState from "./state";
import logger from "../logging/logger";
import playerSettingsService from "../player/settings/service";
import PLAYER_SETTING_NAMES from "../../common/player/setting-names";
import menuService from "../gui/menu/api/service";
import MENU_IDS from "../gui/menu/menu-ids";
import {ItemIconType} from "../../common/gui/menu/item-icon-type";
import {waitOneFrame} from "../../common/wait";

const SNOW_ASSETS = {
  CORE_SNOW: 'core_snow',
  ICE_FOOTSTEPS: 'ICE_FOOTSTEPS',
  SNOW_FOOTSTEPS: 'SNOW_FOOTSTEPS'
};

async function applyInitialSettings() {
  const weatherTypeId = playerSettingsService.getStringSetting(PLAYER_SETTING_NAMES.WEATHER, '');
  const weatherType = SELECTABLE_WEATHER_TYPES.find(wt => wt.id === weatherTypeId) ?? SUNNY;
  await setPermanentWeather(weatherType.id);
  menuService.setItemIcon(MENU_IDS.SETTINGS.WEATHER.MAIN, weatherType.id, ItemIconType.SELECTED);
}

async function setPermanentWeather(weatherTypeId: string) {
  const weatherType = SELECTABLE_WEATHER_TYPES.find(wt => wt.id === weatherTypeId);

  if (undefined === weatherType) {
    throw new Error(`invalid weather type "${weatherTypeId}"`);
  }

  SetWeatherTypeNowPersist(weatherTypeId);
  await toggleSnowProperties(isSnowType(weatherType));
  playerSettingsService.updateSetting(PLAYER_SETTING_NAMES.WEATHER, weatherTypeId);
  logger.info(`set permanent weather to "${weatherTypeId}"`);
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

const weatherService = {
  applyInitialSettings,
  setPermanentWeather
};

export default weatherService;
