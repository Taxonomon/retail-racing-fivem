export type NuiMessageBody = {
  id: string;
  data?: any
};

export const NUI_MSG_IDS = {
  MENU: {
    RENDER: 'txn:gui:menu:render',
    CLEAR: 'txn:gui:menu:clear'
  }
};
