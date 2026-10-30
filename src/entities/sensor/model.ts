import type { SensorId } from "../../shared/config/sensors";

export interface SensorReading {
  sensorId: SensorId;
  value: number;
  at: string; // ISO
}

export interface SeriesPoint {
  at: string; // ISO
  value: number;
}

export interface SensorSeries {
  sensorId: SensorId;
  points: SeriesPoint[];
}
