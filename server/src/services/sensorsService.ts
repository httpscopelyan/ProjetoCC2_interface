import { bucketStart, seriesWindow } from "../domain/period.ts";
import type { Period } from "../domain/period.ts";
import { SENSOR_IDS } from "../domain/sensors.ts";
import type { SensorId } from "../domain/sensors.ts";
import type { ReadingsRepository } from "../db/readingsRepository.ts";

export interface SensorReadingDto {
  sensorId: SensorId;
  value: number;
  at: string;
}

export interface SeriesDto {
  sensorId: SensorId;
  points: { at: string; value: number }[];
}

export type SensorsService = ReturnType<typeof createSensorsService>;

export const createSensorsService = (repository: ReadingsRepository) => ({
  latest(): SensorReadingDto[] {
    return SENSOR_IDS.flatMap((sensorId) => {
      const reading = repository.latest(sensorId);
      return reading ? [{ sensorId, value: reading.value, at: new Date(reading.at).toISOString() }] : [];
    });
  },

  series(sensorId: SensorId, period: Period, day: string | null, now = new Date()): SeriesDto {
    const window = seriesWindow(period, day, now);
    const points = repository.bucketAverages(sensorId, window, window.granularity).map(({ key, value }) => ({
      at: bucketStart(key, window.granularity).toISOString(),
      value,
    }));
    return { sensorId, points };
  },

  availableDays: (): string[] => repository.availableDays(),
});
