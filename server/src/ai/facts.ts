import { addDays, startOfDay } from "../domain/period.ts";
import type { TimeWindow } from "../domain/period.ts";
import { SENSORS, formatValue, resolveState } from "../domain/sensors.ts";
import type { SensorDef, SensorState } from "../domain/sensors.ts";
import type { Aggregate, ReadingsRepository } from "../db/readingsRepository.ts";

export type Trend = "subindo" | "caindo" | "estável";

export interface SensorFacts {
  def: SensorDef;
  value: number;
  at: number;
  state: SensorState;
  today: Aggregate | null;
  yesterdayAverage: number | null;
  trend: Trend | null;
}

const HOUR_MS = 3_600_000;

export const windowEndingNow = (now: Date, startsAt: Date): TimeWindow => ({ from: startsAt.getTime(), to: now.getTime() + 1 });

const trendOf = (def: SensorDef, repository: ReadingsRepository, now: Date): Trend | null => {
  const end = now.getTime() + 1;
  const recent = repository.aggregate(def.id, { from: end - HOUR_MS, to: end });
  const earlier = repository.aggregate(def.id, { from: end - 3 * HOUR_MS, to: end - HOUR_MS });
  if (!recent || !earlier) return null;
  const change = recent.avg - earlier.avg;
  if (Math.abs(change) < def.noticeableChange) return "estável";
  return change > 0 ? "subindo" : "caindo";
};

const collectOne = (def: SensorDef, repository: ReadingsRepository, now: Date): SensorFacts | null => {
  const latest = repository.latest(def.id);
  if (!latest) return null;
  const todayStart = startOfDay(now);
  const yesterday = repository.aggregate(def.id, { from: addDays(todayStart, -1).getTime(), to: todayStart.getTime() });
  return {
    def,
    value: latest.value,
    at: latest.at,
    state: resolveState(def, latest.value),
    today: repository.aggregate(def.id, windowEndingNow(now, todayStart)),
    yesterdayAverage: yesterday?.avg ?? null,
    trend: trendOf(def, repository, now),
  };
};

export const collectFacts = (repository: ReadingsRepository, now = new Date()): SensorFacts[] =>
  SENSORS.flatMap((def) => collectOne(def, repository, now) ?? []);

const describeToday = ({ def, today }: SensorFacts): string =>
  today ? `; hoje: mín ${formatValue(def, today.min)}, média ${formatValue(def, today.avg)}, máx ${formatValue(def, today.max)}` : "";

export const factsToContext = (facts: SensorFacts[]): string =>
  facts
    .map((fact) => `- ${fact.def.title}: ${formatValue(fact.def, fact.value)} (${fact.state.label})${describeToday(fact)}${fact.trend ? `; tendência: ${fact.trend}` : ""}`)
    .join("\n");
