import EVENT_NAMES from "../../common/event-names";
import {handleServerCallbackResponse} from "./service/response";

export function register() {
  onNet(
    EVENT_NAMES.CALLBACK.SERVER.RESPONSE,
    handleServerCallbackResponse
  );
}
