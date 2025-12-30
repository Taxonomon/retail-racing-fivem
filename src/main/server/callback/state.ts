class CallbackState {
  callbackRegister: Map<string, Function> = new Map();
}

const callbackState = new CallbackState();

export default callbackState;
