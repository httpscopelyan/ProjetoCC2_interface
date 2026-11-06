import type { SensorId } from "../../shared/config/sensors";

export interface SensorReading {
  sensorId: SensorId;
  value: number;
  at: string;
}

export interface SeriesPoint {
  at: string;
  value: number;
}

export interface SensorSeries {
  sensorId: SensorId;
  points: SeriesPoint[];
}
