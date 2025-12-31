import {AddToastProps, ToastType} from "../../../common/gui/toasts/add-toast-props";
import sendNuiMessage from "../send-nui-message";
import {NUI_MSG_IDS} from "../../../common/gui/nui-message";
import EVENT_NAMES from "../../../common/event-names";

function showToast(type: ToastType, text: string) {
  sendNuiMessage({
    id: NUI_MSG_IDS.TOASTS.ADD,
    data: { type, text } satisfies AddToastProps
  });
}

const toast = {
  showInfo: (text: string) => showToast('INFO', text),
  showWarning: (text: string) => showToast('WARNING', text),
  showError: (text: string) => showToast('ERROR', text)
};

export default toast;
