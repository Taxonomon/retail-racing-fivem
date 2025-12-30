import Menu from "./menu";
import {Tick} from "../../../../common/tick";
import logger from "../../../logging/logger";

class MenuState {
  register: Menu[] = [];
  stack: string[] = [];
  mainMenu?: string;
  blockControlActions: Tick = new Tick('block menu-impeding control actions', logger);
  blockInputBindings: Tick = new Tick('block menu-impeding input bindings', logger);
  mainMenuLastClosedAt: number = -1;

  hasMenu(id: string) {
    return this.register.some((menu) => menu.id === id);
  }

  getMenu(id: string) {
    return this.register.find(menu => menu.id === id);
  }

  isMenuOpen(id: string) {
    return this.stack.includes(id);
  }

  isAnyMenuOpen() {
    return this.stack.length > 0;
  }

  isMenuRendered(id: string) {
    return this.stack.at(-1) === id;
  }

  getRenderedMenu() {
    return this.register.find((menu) => menu.id === this.stack.at(-1));
  }
}

const menuState = new MenuState();

export default menuState;
