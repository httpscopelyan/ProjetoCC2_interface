import { createContext, useContext } from "react";
import type { Period, Readings, SensorId } from "../../shared/config/sensors";
import type { SensorSeries } from "./model";

export interface SensorData {
  readings: Readings;
  live: Readings;
  seriesBySensor: Partial<Record<SensorId, SensorSeries>>;
  availableDays: string[];
  loading: boolean;
  error: string | null;
}

export interface SensorControls {
  period: Period;
  setPeriod: (period: Period) => void;
  day: string | null;
  setDay: (day: string | null) => void;
  selectedId: SensorId;
  setSelectedId: (id: SensorId) => void;
}

export const SensorDataContext = createContext<SensorData | null>(null);
export const SensorControlsContext = createContext<SensorControls | null>(null);

export const useSensorData = () => {
  const value = useContext(SensorDataContext);
  if (!value) throw new Error("useSensorData precisa estar dentro de SensorDataProvider");
  return value;
};

export const useSensorControls = () => {
  const value = useContext(SensorControlsContext);
  if (!value) throw new Error("useSensorControls precisa estar dentro de SensorDataProvider");
  return value;
};
