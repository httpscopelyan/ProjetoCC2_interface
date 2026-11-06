import type { Period, SensorId } from "../../config/sensors";
import { isoDay } from "../../lib/date";
import type { SensorReading, SensorSeries, SeriesPoint } from "../../../entities/sensor/model";

const OVERRIDES: Partial<Record<SensorId, number>> = {};

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

const rand = (key: string) => {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  let t = (h + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const valueAt = (id: SensorId, date: Date): number => {
  const day = isoDay(date);
  const hour = date.getHours() + date.getMinutes() / 60;
  const bucket = `${id}|${day}|${Math.floor(hour * 2)}`;

  if (id === "luminosity") {
    const daylight = clamp(Math.sin(((hour - 6) / 12) * Math.PI), 0, 1);
    const cloud = 0.65 + rand(`${id}|${day}`) * 0.35;
    return clamp(daylight * 100 * cloud + (rand(bucket) - 0.5) * 6 * daylight, 0, 100);
  }

  if (id === "rain") {
    const r = rand(`${id}|${day}|${Math.floor(hour / 3)}`);
    return r > 0.85 ? Math.round((r - 0.85) * 40 * 10) / 10 : 0;
  }

  const p = PROFILES[id];
  const cycle = Math.sin(((hour - 9) / 24) * 2 * Math.PI);
  const drift = (rand(`${id}|${day}`) - 0.5) * 2 * p.drift;
  return clamp(p.base + p.diurnal * cycle + drift + (rand(bucket) - 0.5) * 2 * p.noise, p.min, p.max);
};

const at = (date: Date) => date.toISOString();

const hourly = (id: SensorId, from: Date, count: number): SeriesPoint[] =>
  Array.from({ length: count }, (_, i) => {
    const d = new Date(from);
    d.setHours(from.getHours() + i, 0, 0, 0);
    return { at: at(d), value: valueAt(id, d) };
  });

const dayAverage = (id: SensorId, day: Date): SeriesPoint => {
  const samples = [0, 4, 8, 12, 16, 20].map((h) => {
    const d = new Date(day);
    d.setHours(h, 0, 0, 0);
    return valueAt(id, d);
  });
  const d = new Date(day);
  d.setHours(12, 0, 0, 0);
  return { at: at(d), value: samples.reduce((a, b) => a + b, 0) / samples.length };
};

const lastDays = (id: SensorId, count: number): SeriesPoint[] =>
  Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (count - 1 - i));
    return dayAverage(id, d);
  });

const lastMonths = (id: SensorId): SeriesPoint[] =>
  Array.from({ length: 12 }, (_, i) => {
    const first = new Date();
    first.setDate(1);
    first.setMonth(first.getMonth() - (11 - i));
    const avg = [3, 10, 17, 24]
      .map((day) => dayAverage(id, new Date(first.getFullYear(), first.getMonth(), day)).value)
      .reduce((a, b) => a + b, 0) / 4;
    return { at: at(new Date(first.getFullYear(), first.getMonth(), 1, 12)), value: avg };
  });

const ids: SensorId[] = ["temperature", "humidity", "pressure", "airQuality", "luminosity", "rain"];

export const mockSensors = {
  latest(): SensorReading[] {
    const now = new Date();
    return ids.map((sensorId) => ({
      sensorId,
      value: OVERRIDES[sensorId] ?? valueAt(sensorId, now),
      at: at(now),
    }));
  },

  series(sensorId: SensorId, period: Period, day: string | null): SensorSeries {
    if (day) {
      const [y, m, d] = day.split("-").map(Number);
      const start = new Date(y, m - 1, d, 0);
      const now = new Date();
      return { sensorId, points: hourly(sensorId, start, 24).filter((p) => new Date(p.at) <= now) };
    }

    if (period === "now") {
      const start = new Date();
      start.setHours(start.getHours() - 23, 0, 0, 0);
      return { sensorId, points: hourly(sensorId, start, 24) };
    }
    if (period === "week") return { sensorId, points: lastDays(sensorId, 7) };
    if (period === "month") return { sensorId, points: lastDays(sensorId, 30) };
    return { sensorId, points: lastMonths(sensorId) };
  },

  availableDays(): string[] {
    return Array.from({ length: 45 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return isoDay(d);
    });
  },
};
