import inputState from "../state";

function start() {
  inputState.bindingListener.start(async () => {
    for (const binding of inputState.bindings) {
      binding.updateInputState();
      await binding.performActionIfPossible();
    }
  });
}

function stop() {
  inputState.bindingListener.stop();
}

const inputBindingListener = { start, stop };

export default inputBindingListener;
