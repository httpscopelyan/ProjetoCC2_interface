import type { DatabaseSync } from "node:sqlite";
import { BUCKET_FORMAT } from "../domain/period.ts";
import type { Granularity, TimeWindow } from "../domain/period.ts";
import type { SensorId } from "../domain/sensors.ts";

export interface Reading {
  sensorId: SensorId;
  value: number;
  at: number;
}

export interface BucketAverage {
  key: string;
  value: number;
}

export interface Aggregate {
  min: number;
  max: number;
  avg: number;
  count: number;
}

export interface Extreme {
  value: number;
  at: number;
}

export type ReadingsRepository = ReturnType<typeof createReadingsRepository>;

export const createReadingsRepository = (db: DatabaseSync) => {
  const insertOne = db.prepare("INSERT INTO readings (sensor_id, at, value) VALUES (?, ?, ?)");
  const latestOne = db.prepare("SELECT value, at FROM readings WHERE sensor_id = ? ORDER BY at DESC LIMIT 1");
  const aggregateOne = db.prepare(
    "SELECT MIN(value) AS min, MAX(value) AS max, AVG(value) AS avg, COUNT(*) AS count FROM readings WHERE sensor_id = ? AND at >= ? AND at < ?",
  );
  const lowest = db.prepare("SELECT value, at FROM readings WHERE sensor_id = ? AND at >= ? AND at < ? ORDER BY value ASC LIMIT 1");
  const highest = db.prepare("SELECT value, at FROM readings WHERE sensor_id = ? AND at >= ? AND at < ? ORDER BY value DESC LIMIT 1");
  const days = db.prepare("SELECT DISTINCT strftime('%Y-%m-%d', at / 1000, 'unixepoch', 'localtime') AS day FROM readings ORDER BY day DESC");
  const total = db.prepare("SELECT COUNT(*) AS count FROM readings");
  const bucketStatements = Object.fromEntries(
    (Object.keys(BUCKET_FORMAT) as Granularity[]).map((granularity) => [
      granularity,
      db.prepare(`
        SELECT strftime('${BUCKET_FORMAT[granularity]}', at / 1000, 'unixepoch', 'localtime') AS key, AVG(value) AS value
        FROM readings WHERE sensor_id = ? AND at >= ? AND at < ?
        GROUP BY key ORDER BY key
      `),
    ]),
  ) as Record<Granularity, ReturnType<DatabaseSync["prepare"]>>;

  return {
    insertMany(readings: Reading[]): void {
      db.exec("BEGIN");
      try {
        for (const { sensorId, at, value } of readings) insertOne.run(sensorId, at, value);
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
    },

    latest(sensorId: SensorId): Reading | null {
      const row = latestOne.get(sensorId) as { value: number; at: number } | undefined;
      return row ? { sensorId, ...row } : null;
    },

    bucketAverages(sensorId: SensorId, { from, to }: TimeWindow, granularity: Granularity): BucketAverage[] {
      return bucketStatements[granularity].all(sensorId, from, to) as unknown as BucketAverage[];
    },

    aggregate(sensorId: SensorId, { from, to }: TimeWindow): Aggregate | null {
      const row = aggregateOne.get(sensorId, from, to) as unknown as Aggregate;
      return row.count > 0 ? row : null;
    },

    extremes(sensorId: SensorId, { from, to }: TimeWindow): { lowest: Extreme; highest: Extreme } | null {
      const low = lowest.get(sensorId, from, to) as Extreme | undefined;
      const high = highest.get(sensorId, from, to) as Extreme | undefined;
      return low && high ? { lowest: low, highest: high } : null;
    },

    availableDays: (): string[] => (days.all() as { day: string }[]).map(({ day }) => day),

    count: (): number => (total.get() as { count: number }).count,
  };
};
