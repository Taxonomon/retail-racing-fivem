import {Vector3} from "../../../common/vector";

function getCoords(): Vector3 {
  const [ x, y, z ] = GetEntityCoords(PlayerPedId());
  return { x, y, z };
}

const playerUtilService = {
  getCoords
};

export default playerUtilService;
