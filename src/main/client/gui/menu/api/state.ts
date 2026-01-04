import Menu from "./menu";
import {Tick} from "../../../../common/tick";
import logger from "../../../logging/logger";

class MenuState {
  register: Menu[] = [];
  stack: string[] = [];
  mainMenu?: string;
  blockImpedingControlActions: Tick = new Tick('block menu-impeding control actions', logger);
  mainMenuLastClosedAt: number = -1;
}

const menuState = new MenuState();

export default menuState;
