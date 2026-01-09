const CALLBACK_NAMES = {
  MENU: {
    ACCESS: {
      MODERATION: 'txn:callback:menu:access:moderation',
      ADMINISTRATION: 'txn:callback:menu:access:administration',
    }
  },
  TRACK: {
    IMPORT: 'txn:callback:track:import',
    FETCH_TRACKLIST: 'txn:callback:track:fetch-all-available'
  },
  PLAYER: {
    SETTINGS: {
      FETCH: 'txn:callback:player:settings:fetch',
      SAVE: 'txn:callback:player:settings:save'
    }
  },
  VEHICLE: {
    SPAWN: {
      IS_BLOCKED_MODEL_ID: 'txn:callback:vehicle:spawn:is-blocked-model-id',
      FILTER_BLOCKED_MODEL_IDS: 'txn:callback:vehicle:filter-blocked-model-ids'
    }
  }
};

export default CALLBACK_NAMES;
