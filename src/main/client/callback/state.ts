import {ActiveCallbackRequest} from "../../common/callback/request";

class CallbackState {
  activeCallbackRequests: ActiveCallbackRequest[] = [];
}

export const callbackState = new CallbackState();
