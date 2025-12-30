const wait = {
  oneFrame: () => wait.millis(0),
  millis: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
};

export default wait;
