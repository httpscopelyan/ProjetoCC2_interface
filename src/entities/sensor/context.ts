import { createContext, useContext } from "react";
import type { Period, Readings, SensorId } from "../../shared/config/sensors";
import type { SensorSeries } from "./model";

// Two contexts on purpose: controls change on clicks/hover, data changes on fetches; splitting them
// keeps one from re-rendering the other's consumers.
export interface SensorData {
  readings: Readings; // what the cards show: latest reading in "now" mode, otherwise the average of the series
  live: Readings; // always the latest reading (drives the ambient effects)
  seriesBySensor: Partial<Record<SensorId, SensorSeries>>;
  availableDays: string[]; // YYYY-MM-DD days that have captured data
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
