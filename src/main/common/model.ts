import {waitOneFrame} from "./wait";

const CANCEL_LOAD_AFTER_MS = 5000;

export async function loadModelByHash(hash: number, options?: {
  timeoutAfterMs?: number;
}): Promise<void> {
  const timeoutMs = options?.timeoutAfterMs ?? CANCEL_LOAD_AFTER_MS;
  let start = Date.now();
  let loaded = false;

  RequestModel(hash);

  while (!loaded) {
    if (Date.now() - start >= timeoutMs) {
      throw new Error(
        `model loading request for hash ${hash} ran into timeout `+
        `(model was not loaded after ${timeoutMs} ms)`
      );
    }
    loaded = HasModelLoaded(hash);
    await waitOneFrame();
  }
}
