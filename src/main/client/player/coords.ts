import playerState from "./state";

export default function startTrackingPlayerCoordinates() {
  playerState.trackCoords.start(() => {
    const [ x, y, z ] = GetEntityCoords(PlayerPedId());
    playerState.coords = { x, y, z };
  });
}
