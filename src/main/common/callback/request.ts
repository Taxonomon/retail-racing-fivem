import {CallbackResult} from "./result";

export type ActiveCallbackRequest = {
  requestId: string;
  identifier: string;
  startedAt?: number;
  response?: CallbackResult;
};
