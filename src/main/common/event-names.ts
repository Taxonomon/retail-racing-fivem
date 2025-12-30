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
    PING: 'txn:player:ping'
  }
};

export default EVENT_NAMES;
