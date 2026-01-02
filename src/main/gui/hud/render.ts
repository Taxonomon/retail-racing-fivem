import $ from 'jquery';
import hudState from "./state";
import {HudRenderProps} from "../../common/gui/hud/render-props";

const CLASSES = {
  HUD: 'hud',
  SPEED: 'speed',
  WRAPPER: 'wrapper',
  UNIT: 'unit',
  VALUE: 'value',
  DROP_SHADOW_1C5PX: 'drop-shadow-1c5px',
  DROP_SHADOW_2PX: 'drop-shadow-2px'
};

function loadRootNode() {
  hudState.rootNode = $(`.${CLASSES.HUD}`);
}

function render(props: HudRenderProps) {
  hudState.rootNode?.empty().html(hudHtml(props));
}

function hudHtml(props: HudRenderProps) {
  // TODO construc hud HTML based on HudType
  // for now, this displays speed only
  return `
    <div class="${CLASSES.SPEED}">
      <div class="${CLASSES.WRAPPER}">
        <span class="${CLASSES.VALUE} ${CLASSES.DROP_SHADOW_2PX}">
          ${props.speed.value.toFixed(props.speed.precision)}
        </span>
        <span class="${CLASSES.UNIT} ${CLASSES.DROP_SHADOW_1C5PX}">
          ${props.speed.unit.symbol}
        </span>
      </div>
    </div>
  `;
}

const hud = {
  loadRootNode,
  render
};

export default hud;
