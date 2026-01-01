import $ from 'jquery';
import toastState from "./state";
import {AddToastProps} from "../../common/gui/toasts/add-toast-props";
import logger from "../logging/logger";

const CLASSES = {
  TOASTS: 'toasts',
  TOAST: 'toast',
  LABEL: 'label',
  TEXT: 'text',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error'
};

const HIDE_TOASTS_AFTER_MS = 8000;

function loadRootNode() {
  toastState.rootNode = $(`.${CLASSES.TOASTS}`);
}

async function startRemovingExpiredToasts() {
  setInterval(async () => hideExpiredToasts(), 250);
}

function addToast(props: AddToastProps) {
  let toastTypeClass = CLASSES.INFO;
  const toastId = new Date().getTime();

  if ('WARNING' === props.type) {
    toastTypeClass = CLASSES.WARNING;
  } else if ('ERROR' === props.type) {
    toastTypeClass = CLASSES.ERROR;
  }

  const toast = $(`
    <div class="${CLASSES.TOAST} ${toastTypeClass}" id="${toastId}">
      <div class="${CLASSES.LABEL}">${props.type}</div>
      <div class="${CLASSES.TEXT}">${props.text}</div>
    </div>
  `);

  toastState.rootNode?.prepend(toast.hide().fadeIn(250));

  toastState.addedToasts.add(toastId);
}

function hideExpiredToasts() {
  logger.debug(`hiding expired toasts...`);
  let toastIdsToRemove: Set<number> = new Set();
  const now = new Date().getTime();

  toastState.addedToasts.forEach(toastId => {
    if (now - toastId >= HIDE_TOASTS_AFTER_MS) {
      toastIdsToRemove.add(toastId);
    }
  });

  toastIdsToRemove.forEach(toastId => {
    const toast = toastState.rootNode?.find(`#${toastId}`);
    if (undefined !== toast) {
      toast.fadeOut(250, function () {
        $(this).remove();
      })
    }
    toastState.addedToasts.delete(toastId);
    logger.debug(`removed toast "${toastId}"`);
  });
}

const toasts = {
  loadRootNode,
  startRemovingExpiredToasts,
  addToast
};

export default toasts;
