const CALLBACK_NAMES = {
  MENU: {
    ACCESS: {
      MODERATION: 'txn:callback:menu:access:moderation',
      ADMINISTRATION: 'txn:callback:menu:access:administration',
    }
  },
  TRACK: {
    IMPORT: 'txn:callback:track:import'
  },
  PLAYER: {
    SETTINGS: {
      FETCH: 'txn:callback:player:settings:fetch'
    }
  }
};

export default CALLBACK_NAMES;
