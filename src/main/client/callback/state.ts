import {ActiveCallbackRequest} from "../../common/callback/request";

class CallbackState {
  activeCallbackRequests: ActiveCallbackRequest[] = [];

  hasActiveCallbackRequest(callbackRequest: ActiveCallbackRequest) {
    return this.activeCallbackRequests.some(acr =>
      acr.identifier === callbackRequest.identifier
      && acr.requestId === callbackRequest.requestId
    );
  }

  removeActiveCallbackRequest(requestId: string, identifier: string) {
    const index = this.activeCallbackRequests.findIndex(acr =>
      acr.identifier === identifier && acr.requestId === requestId
    );
    if (index > -1) {
      this.activeCallbackRequests.splice(index, 1);
    }
  }
}

const callbackState = new CallbackState();

export default callbackState;
