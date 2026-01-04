export async function waitOneFrame() {
  await wait(0);
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
