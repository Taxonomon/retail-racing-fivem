import breadcrumpsState from "./state";
import {BreadCrumpsProps} from "../../common/gui/breadcrumps/breadcrumps-props";
import logger from "../logging/logger";
import $ from 'jquery';

const CLASSES = {
  BREADCRUMPS: 'breadcrumps',
  FPS: 'fps',
  CLOCK: 'clock',
  PING: 'ping'
};

function loadRootNode() {
  breadcrumpsState.rootNode = $(`.${CLASSES.BREADCRUMPS}`);
}

function render(props: BreadCrumpsProps) {
  const rootNode = breadcrumpsState.rootNode;

  if (undefined === rootNode) {
    logger.warn(`cannot render breadcrumps: root node undefined`);
    return;
  }

  rootNode.find(`.${CLASSES.FPS}`).html(`${props.fps.toFixed(0)} fps`);
  rootNode.find(`.${CLASSES.PING}`).html(`${props.pingMs.toString()} ms`);
  rootNode.find(`.${CLASSES.CLOCK}`).html(
    new Intl.DateTimeFormat("en-GB", {
      year: 'numeric',
      month: 'short',
      weekday: 'short',
      day: 'numeric',
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
      timeZoneName: 'short'
    }).format(new Date())
  );
}

const breadcrumps = { loadRootNode, render };

export default breadcrumps;
