class MenuState {
  rootNode?: JQuery;

  getRootNode() {
    if (undefined === this.rootNode) {
      throw new Error(`root node undefined`);
    }
    return this.rootNode;
  }
}

const menuState = new MenuState();

export default menuState;
