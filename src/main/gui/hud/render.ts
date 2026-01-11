import $ from 'jquery';
import hudState from "./state";
import {HudRenderProps} from "../../common/gui/hud/render-props";
import {CLASSES} from "./constants";
import {EntitySpeed} from "../../common/entity-speed";

export function loadRootNode() {
  hudState.rootNode = $(`.${CLASSES.HUD}`);
}

export function render(props: HudRenderProps) {
  hudState.rootNode?.empty().html(`
    ${undefined === props.gear || undefined === props.rpm ? '' : engineHtml(props.rpm, props.gear)}
    ${speedHtml(props.speed)}
  `);
}

function speedHtml(speed: EntitySpeed) {
  return `
    <div class="${CLASSES.SPEED}">
        <span class="${CLASSES.VALUE} ${CLASSES.DROP_SHADOW_2PX}">
          ${speed.value.toFixed(speed.precision)}
        </span>
        <span class="${CLASSES.UNIT} ${CLASSES.DROP_SHADOW_1C5PX}">
          ${speed.unit.symbol}
        </span>
    </div>
  `;
}

function engineHtml(rpm: number, gear: string | number) {
  return `
    <div class="${CLASSES.ENGINE}">
      <div class="${CLASSES.GEAR}">
        <span class="${CLASSES.VALUE}">${gear}</span>
        <span class="${CLASSES.ICON} ${CLASSES.MATERIAL_SYMBOLS_OUTLINED}">auto_transmission</span>
      </div>
      <div class="${CLASSES.RPM}">
        <span class="${CLASSES.VALUE}">${(rpm * 10).toFixed(1)}</span>
        <span class="${CLASSES.ICON} ${CLASSES.MATERIAL_SYMBOLS_OUTLINED}">speed</span>
      </div>
    </div>
  `;
}
