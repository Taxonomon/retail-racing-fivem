export type NuiMessageBody = {
  id: string;
  data?: any
};

export const NUI_MSG_IDS = {
  MENU: {
    RENDER: 'txn:gui:menu:render',
    CLEAR: 'txn:gui:menu:clear'
  },
  BREADCRUMPS: 'txn:gui:breadcrumps',
  TOASTS: {
    ADD: 'txn:gui:toasts:add'
  },
  HUD: 'txn:gui:hud',
  LAP_TIMER: {
    RENDER: 'txn:gui:lap-timer:render',
    HIDE: 'txn:gui:lap-timer:hide'
  }
};
