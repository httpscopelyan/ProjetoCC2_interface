import { useSyncExternalStore } from "react";
import { localLlm } from "../../shared/api/localLlm";
import type { LocalAiStatus } from "../../shared/api/localLlm";

export const useLocalAiStatus = (): LocalAiStatus =>
  useSyncExternalStore(localLlm.subscribe, localLlm.getStatus);
