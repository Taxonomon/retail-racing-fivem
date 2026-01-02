const EVENT_NAMES = {
  CALLBACK: {
    CLIENT: {
      REQUEST: 'txn:callback:client:request',
      RESPONSE: 'txn:callback:client:response',
    },
    SERVER: {
      REQUEST: 'txn:callback:server:request',
      RESPONSE: 'txn:callback:server:response'
    }
  },
  PLAYER: {
    KICK: {
      SELF: 'txn:player:kick:self'
    },
    PING: 'txn:player:ping',
    SETTINGS: {
      UPDATE: 'txn:player:settings:update'
    }
  },
  MESSAGE: {
    FROM: {
      SERVER: 'txn:message:from:server'
    }
  }
};

export default EVENT_NAMES;
