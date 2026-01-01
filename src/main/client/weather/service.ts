import {SELECTABLE_WEATHER_TYPES, SNOW_TYPES, WeatherType} from "./weather-type";
import weatherState from "./state";
import wait from "../../common/wait";
import logger from "../logging/logger";

const SNOW_ASSETS = {
  CORE_SNOW: 'core_snow',
  ICE_FOOTSTEPS: 'ICE_FOOTSTEPS',
  SNOW_FOOTSTEPS: 'SNOW_FOOTSTEPS'
};

async function setPermanentWeather(weatherTypeId: string) {
  const weatherType = SELECTABLE_WEATHER_TYPES.find(wt => wt.id === weatherTypeId);

  if (undefined === weatherType) {
    throw new Error(`invalid weather type "${weatherTypeId}"`);
  }

  SetWeatherTypeNowPersist(weatherTypeId);
  await toggleSnowProperties(isSnowType(weatherType));
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
    await wait.oneFrame();
  }

  UseParticleFxAsset(SNOW_ASSETS.CORE_SNOW);
}

const weatherService = {
  setPermanentWeather
};

export default weatherService;
