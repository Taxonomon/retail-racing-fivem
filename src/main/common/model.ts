import wait from "./wait";

const CANCEL_LOAD_AFTER_MS = 5000;

async function load(hash: number) {
  let start = Date.now();
  let loaded = false;

  RequestModel(hash);

  while (!loaded) {
    if (Date.now() - start >= CANCEL_LOAD_AFTER_MS) {
      throw new Error(`model load timed out after ${CANCEL_LOAD_AFTER_MS} ms`);
    }
    loaded = HasModelLoaded(hash);
    await wait.oneFrame();
  }
}

export const model = { load };

export default model;
