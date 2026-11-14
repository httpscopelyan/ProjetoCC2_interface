import { useEffect } from "react";
import { localLlm } from "../shared/api/localLlm";
import { useSettings } from "../entities/settings/context";

const AFTER_ENTRANCE_ANIMATIONS_MS = 3000;
const IDLE_TIMEOUT_MS = 4000;

const LocalAiPreloader = () => {
  const { localAi } = useSettings();

  useEffect(() => {
    if (!localAi) return;
    let idleHandle: number | undefined;
    const timer = setTimeout(() => {
      idleHandle = window.requestIdleCallback(() => void localLlm.preload(), { timeout: IDLE_TIMEOUT_MS });
    }, AFTER_ENTRANCE_ANIMATIONS_MS);

    return () => {
      clearTimeout(timer);
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
    };
  }, [localAi]);

  return null;
};

export default LocalAiPreloader;
