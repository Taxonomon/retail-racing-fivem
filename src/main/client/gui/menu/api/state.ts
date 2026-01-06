import Menu from "./menu";
import {Tick} from "../../../../common/tick";
import logger from "../../../logging/logger";

class MenuApiState {
  register: Menu[] = [];
  stack: string[] = [];
  mainMenu?: string;
  blockImpedingControlActions: Tick = new Tick('block menu-impeding control actions', logger);
  mainMenuLastClosedAt: number = -1;
}

const menuApiState = new MenuApiState();

export default menuApiState;
