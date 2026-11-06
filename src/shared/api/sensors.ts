import type { Period, SensorId } from "../config/sensors";
import type { SensorReading, SensorSeries } from "../../entities/sensor/model";
import { USE_MOCK, delay, get } from "./client";
import { mockSensors } from "./mock/sensors";

export const sensorsApi = {
  async latest(): Promise<SensorReading[]> {
    if (USE_MOCK) {
      await delay(80);
      return mockSensors.latest();
    }
    return get<SensorReading[]>("/api/sensors/latest");
  },

  async series(sensorId: SensorId, period: Period, day: string | null): Promise<SensorSeries> {
    if (USE_MOCK) {
      await delay(80);
      return mockSensors.series(sensorId, period, day);
    }
    const params: Record<string, string> = { period };
    if (day) params.day = day;
    return get<SensorSeries>(`/api/sensors/${sensorId}/series`, params);
  },

  async availableDays(): Promise<string[]> {
    if (USE_MOCK) {
      await delay(80);
      return mockSensors.availableDays();
    }
    return get<string[]>("/api/sensors/available-days");
  },
};
