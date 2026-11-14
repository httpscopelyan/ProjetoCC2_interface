import { createContext, useContext } from "react";
import type { SensorId } from "../../shared/config/sensors";
import type { Thresholds } from "./thresholds";

export interface Settings {
  thresholds: Thresholds;
  setSensorThresholds: (sensorId: SensorId, edges: number[]) => void;
  resetThresholds: () => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  localAi: boolean;
  setLocalAi: (enabled: boolean) => void;
}

export const SettingsContext = createContext<Settings | null>(null);

export const useSettings = () => {
  const value = useContext(SettingsContext);
  if (!value) throw new Error("useSettings precisa estar dentro de SettingsProvider");
  return value;
};
