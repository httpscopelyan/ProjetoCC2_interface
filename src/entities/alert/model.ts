import type { SensorId } from "../../shared/config/sensors";

export type AlertSeverity = "info" | "warning" | "critical";

export interface Alert {
  id: string;
  sensorId: SensorId;
  severity: AlertSeverity;
  title: string;
  message: string;
  at: string; // ISO
}
