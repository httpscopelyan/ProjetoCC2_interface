import { useCallback, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "usehooks-ts";

import { USE_MOCK } from "../../shared/api/client";
import type { SensorId } from "../../shared/config/sensors";
import { SettingsContext } from "../../entities/settings/context";
import type { Settings } from "../../entities/settings/context";
import type { Thresholds } from "../../entities/settings/thresholds";

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [thresholds, setThresholds] = useLocalStorage<Thresholds>("settings.thresholds", {});
  const [highContrast, setHighContrast] = useLocalStorage("settings.highContrast", false);
  const [localAi, setLocalAi] = useLocalStorage("settings.localAi.v2", USE_MOCK);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-high-contrast", highContrast);
  }, [highContrast]);

  const setSensorThresholds = useCallback(
    (sensorId: SensorId, edges: number[]) => setThresholds((current) => ({ ...current, [sensorId]: edges })),
    [setThresholds],
  );
  const resetThresholds = useCallback(() => setThresholds({}), [setThresholds]);

  const settings = useMemo<Settings>(
    () => ({ thresholds, setSensorThresholds, resetThresholds, highContrast, setHighContrast, localAi, setLocalAi }),
    [thresholds, setSensorThresholds, resetThresholds, highContrast, setHighContrast, localAi, setLocalAi],
  );

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
};
