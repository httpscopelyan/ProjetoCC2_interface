import { SENSOR_BY_ID, isSensorId } from "../domain/sensors.ts";
import type { Reading } from "../db/readingsRepository.ts";

interface RawReading {
  sensorId?: unknown;
  value?: unknown;
  at?: unknown;
}

export interface IngestResult {
  readings: Reading[];
  errors: string[];
}

const MAX_BATCH = 500;
const MAX_CLOCK_SKEW_MS = 5 * 60_000;

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

const toRawReadings = (body: unknown): RawReading[] => {
  if (!isRecord(body)) return [];
  if (Array.isArray(body.readings)) return body.readings.slice(0, MAX_BATCH) as RawReading[];
  return Object.entries(body)
    .filter(([key]) => isSensorId(key))
    .map(([sensorId, value]) => ({ sensorId, value }));
};

const parseTimestamp = (raw: unknown, now: number): number | null => {
  if (raw === undefined) return now;
  const timestamp = typeof raw === "number" ? raw : Date.parse(String(raw));
  return Number.isFinite(timestamp) && timestamp <= now + MAX_CLOCK_SKEW_MS ? timestamp : null;
};

export const parseIngest = (body: unknown, now = Date.now()): IngestResult => {
  const readings: Reading[] = [];
  const errors: string[] = [];

  toRawReadings(body).forEach((raw, index) => {
    const sensorId = String(raw.sensorId);
    const value = typeof raw.value === "number" ? raw.value : Number.NaN;
    const at = parseTimestamp(raw.at, now);
    if (!isSensorId(sensorId)) return errors.push(`#${index}: sensor desconhecido "${sensorId}"`);
    const [min, max] = SENSOR_BY_ID[sensorId].validRange;
    if (!Number.isFinite(value) || value < min || value > max) return errors.push(`#${index}: valor de ${sensorId} fora de ${min}..${max}`);
    if (at === null) return errors.push(`#${index}: data inválida ou no futuro`);
    readings.push({ sensorId, value, at });
  });

  if (readings.length === 0 && errors.length === 0) errors.push("nenhuma leitura encontrada no corpo da requisição");
  return { readings, errors };
};
