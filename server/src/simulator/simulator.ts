import { SENSOR_IDS } from "../domain/sensors.ts";
import type { SensorId } from "../domain/sensors.ts";
import type { Reading, ReadingsRepository } from "../db/readingsRepository.ts";

interface Profile {
  base: number;
  diurnal: number;
  drift: number;
  noise: number;
  min: number;
  max: number;
}

const PROFILES: Record<Exclude<SensorId, "luminosity" | "rain">, Profile> = {
  temperature: { base: 24, diurnal: 5, drift: 4, noise: 0.5, min: -5, max: 45 },
  humidity: { base: 62, diurnal: -14, drift: 10, noise: 2, min: 10, max: 100 },
  pressure: { base: 1013, diurnal: 2, drift: 8, noise: 1, min: 980, max: 1040 },
  airQuality: { base: 45, diurnal: 12, drift: 14, noise: 4, min: 5, max: 200 },
};

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;
const HISTORY_DAYS = 365;
const DETAILED_DAYS = 2;
const DETAILED_STEP_MS = 5 * MINUTE_MS;

const seededRandom = (key: string) => {
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) hash = Math.imul(hash ^ key.charCodeAt(i), 16777619);
  let t = (hash + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const simulatedValue = (sensorId: SensorId, date: Date): number => {
  const day = dayKey(date);
  const hour = date.getHours() + date.getMinutes() / 60;
  const halfHourBucket = `${sensorId}|${day}|${Math.floor(hour * 2)}`;

  if (sensorId === "luminosity") {
    const daylight = clamp(Math.sin(((hour - 6) / 12) * Math.PI), 0, 1);
    const cloud = 0.65 + seededRandom(`${sensorId}|${day}`) * 0.35;
    return clamp(daylight * 100 * cloud + (seededRandom(halfHourBucket) - 0.5) * 6 * daylight, 0, 100);
  }
  if (sensorId === "rain") {
    const chance = seededRandom(`${sensorId}|${day}|${Math.floor(hour / 3)}`);
    return chance > 0.85 ? Math.round((chance - 0.85) * 40 * 10) / 10 : 0;
  }

  const profile = PROFILES[sensorId];
  const cycle = Math.sin(((hour - 9) / 24) * 2 * Math.PI);
  const drift = (seededRandom(`${sensorId}|${day}`) - 0.5) * 2 * profile.drift;
  const noise = (seededRandom(halfHourBucket) - 0.5) * 2 * profile.noise;
  return clamp(profile.base + profile.diurnal * cycle + drift + noise, profile.min, profile.max);
};

const snapshotAt = (timestamp: number): Reading[] =>
  SENSOR_IDS.map((sensorId) => ({ sensorId, at: timestamp, value: simulatedValue(sensorId, new Date(timestamp)) }));

const historyTimestamps = (now: number): number[] => {
  const detailedStart = now - DETAILED_DAYS * DAY_MS;
  const timestamps: number[] = [];
  for (let t = now - HISTORY_DAYS * DAY_MS; t < detailedStart; t += HOUR_MS) timestamps.push(t);
  for (let t = detailedStart; t < now; t += DETAILED_STEP_MS) timestamps.push(t);
  return timestamps;
};

export const startSimulator = (repository: ReadingsRepository, intervalMs: number): (() => void) => {
  if (repository.count() === 0) {
    const history = historyTimestamps(Date.now()).flatMap(snapshotAt);
    repository.insertMany(history);
    console.log(`[simulador] histórico gerado: ${history.length} leituras`);
  }
  const timer = setInterval(() => repository.insertMany(snapshotAt(Date.now())), intervalMs);
  return () => clearInterval(timer);
};
