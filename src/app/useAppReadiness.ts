import { useEffect, useState } from "react";
import backgroundImage from "../assets/background_ambient.webp";
import { useSensorData } from "../entities/sensor/context";

const MIN_LOADING_MS = 700;
const MAX_LOADING_MS = 6000;

const waitForAssets = async () => {
  const image = new Image();
  image.src = backgroundImage;
  await Promise.all([image.decode().catch(() => undefined), document.fonts.ready]);
};

export const useAppReadiness = (): boolean => {
  const { loading, error } = useSensorData();
  const [assetsReady, setAssetsReady] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    waitForAssets().then(() => !cancelled && setAssetsReady(true));
    const minTimer = setTimeout(() => setMinTimeElapsed(true), MIN_LOADING_MS);
    const maxTimer = setTimeout(() => setTimedOut(true), MAX_LOADING_MS);
    return () => {
      cancelled = true;
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  const dataReady = !loading || error !== null;
  return timedOut || (assetsReady && minTimeElapsed && dataReady);
};
