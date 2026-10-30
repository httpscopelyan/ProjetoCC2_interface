import type { Period, SensorId } from "../config/sensors";
import type { SensorReading, SensorSeries } from "../../entities/sensor/model";
import { USE_MOCK, delay, get } from "./client";
import { mockSensors } from "./mock/sensors";

// Single swap point for the sensor backend: set VITE_USE_MOCK=false and VITE_API_BASE_URL to use the real endpoints.
export const sensorsApi = {
  // GET /api/sensors/latest -> SensorReading[]
  async latest(): Promise<SensorReading[]> {
    if (USE_MOCK) {
      await delay(80);
      return mockSensors.latest();
    }
    return get<SensorReading[]>("/api/sensors/latest");
  },

  // GET /api/sensors/:id/series?period=now|week|month|year&day=YYYY-MM-DD -> SensorSeries
  // `day`, when present, takes precedence over `period` (hourly points for that day).
  async series(sensorId: SensorId, period: Period, day: string | null): Promise<SensorSeries> {
    if (USE_MOCK) {
      await delay(80);
      return mockSensors.series(sensorId, period, day);
    }
    const params: Record<string, string> = { period };
    if (day) params.day = day;
    return get<SensorSeries>(`/api/sensors/${sensorId}/series`, params);
  },

  // GET /api/sensors/available-days -> string[] (YYYY-MM-DD days that have captured data)
  async availableDays(): Promise<string[]> {
    if (USE_MOCK) {
      await delay(80);
      return mockSensors.availableDays();
    }
    return get<string[]>("/api/sensors/available-days");
  },
};
