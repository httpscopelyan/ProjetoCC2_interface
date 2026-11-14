import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import LoadingScreen from "../widgets/LoadingScreen";
import { AppReadyContext } from "./AppReady";
import { useAppReadiness } from "./useAppReadiness";

const FADE_OUT_MS = 700;

const AppGate = ({ children }: { children: ReactNode }) => {
  const ready = useAppReadiness();
  const [screenVisible, setScreenVisible] = useState(true);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => setScreenVisible(false), FADE_OUT_MS);
    return () => clearTimeout(timer);
  }, [ready]);

  return (
    <AppReadyContext.Provider value={ready}>
      {children}
      {screenVisible && <LoadingScreen leaving={ready} />}
    </AppReadyContext.Provider>
  );
};

export default AppGate;
