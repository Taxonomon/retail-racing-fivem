import {CallbackResult} from "../../common/callback/schemas";

export interface TriggerServerCallbackProps {
  identifier: string;
  data?: any;
  timeoutMs?: number;
}

export interface CallbackRequest {
  identifier: string;
  requestId: string;
  startedAt?: number;
  response?: CallbackResult
}
