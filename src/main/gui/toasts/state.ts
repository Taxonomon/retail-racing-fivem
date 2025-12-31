class ToastState {
  rootNode?: JQuery;
  // entries are both ids of nodes, as well as timestamps of when they were added to the DOM
  addedToasts: Set<number> = new Set();
}

const toastState = new ToastState();

export default toastState;
