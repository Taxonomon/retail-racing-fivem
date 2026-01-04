import {CommonLogger} from "./logging/logger";
import {wait} from "./wait";

export class Tick {
  private _index?: number;
  private _startedAt?: Date;
  readonly name: string;
  private readonly logger: CommonLogger;

  constructor(name: string, logger: CommonLogger) {
    this.name = name;
    this.logger = logger;
  }

  isRunning() {
    return undefined !== this._index;
  }

  start(handler: Function, intervalMs: number = 0) {
    if (undefined === this._index) {
      this._index ??= setTick(async () => {
        await handler();
        if (0 !== intervalMs) {
          await wait(intervalMs);
        }
      });
      this._startedAt = new Date();
      this.logger.debug(
        `Started running tick "${this.name}" every `
        + `${intervalMs === 0 ? 'frame' : intervalMs.toString() + 'ms'}`
      );
    } else {
      this.logger.error(`Couldn't start tick "${this.name}": tick is already running`);
    }
  }

  stop(handler?: Function) {
    if (undefined === this._index) {
      this.logger.error(`Couldn't stop tick "${this.name}": tick is not running`);
    } else {
      clearTick(this._index);
      if (undefined !== handler) {
        handler();
      }
      this._index = undefined;
      this._startedAt = undefined;
      this.logger.debug(`Stopped tick "${this.name}"`);
    }
  }

  get startedAt() {
    if (this.isRunning()) {
      return this._startedAt;
    } else {
      throw new Error('tick has not yet started');
    }
  }
}
