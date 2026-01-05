const MENU_IDS = {
  MAIN: 'main',
  TRACK: {
    MAIN: 'track'
  },
  VEHICLE: {
    MAIN: 'vehicle',
    SPAWN: {
      MAIN: 'vehicle-spawn',
      ALL: 'vehicle-spawn-all',
      BY_BEGINNING_LETTER: 'vehicle-spawn-by-beginning-letter',
      BY_CLASS: 'vehicle-spawn-by-class',
      BY_BRAND: 'vehicle-spawn-by-brand',
      RECENTLY_SPAWNED: 'vehicle-spawn-recently-spawned'
    }
  },
  SETTINGS: {
    MAIN: 'settings',
    TIME: {
      MAIN: 'settings-time',
      SELECT_TIME: {
        MAIN: 'settings-time-select-time'
      }
    },
    HUD: {
      MAIN: 'settings-hud',
      SPEED_UNIT: {
        MAIN: 'settings-speed-unit'
      }
    },
    WEATHER: {
      MAIN: 'settings-weather'
    }
  },
  MODERATION: {
    MAIN: 'moderation'
  },
  ADMINISTRATION: {
    MAIN: 'administration'
  },
  HOT_LAP: {
    MAIN: 'hot-lap'
  }
};

export default MENU_IDS;
