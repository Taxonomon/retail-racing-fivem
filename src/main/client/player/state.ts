class PlayerState {
  pingMs?: number;
  // TODO keep connected players with netId, dbId and permissions/principals in state while they're connected
}

const playerState = new PlayerState();

export default playerState;
