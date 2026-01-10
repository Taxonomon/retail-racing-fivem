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
  },
  MESSAGE: {
    FROM: {
      SERVER: 'txn:message:from:server'
    }
  },
  TRACK: {
    CHECKPOINT: {
      PASSED:'txn:track:checkpoint:passed'
    }
  }
};

export default EVENT_NAMES;
