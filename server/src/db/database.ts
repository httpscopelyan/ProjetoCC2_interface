import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";

export const openDatabase = (path: string): DatabaseSync => {
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS readings (
      sensor_id TEXT NOT NULL,
      at INTEGER NOT NULL,
      value REAL NOT NULL
    );
    CREATE INDEX IF NOT EXISTS readings_sensor_time ON readings (sensor_id, at);
  `);
  return db;
};
