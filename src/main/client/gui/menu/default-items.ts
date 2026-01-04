import {ItemConstructorProps} from "./api/item";
import {ItemIconType} from "../../../common/gui/menu/item-icon-type";
import playSound from "../../sound";
import toast from "../toasts/service";
import EVENT_NAMES from "../../../common/event-names";
import menuService from "./api/service";
import MENU_IDS from "./menu-ids";
import {wait} from "../../../common/wait";
