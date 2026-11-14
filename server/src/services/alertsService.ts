import { bucketStart } from "../domain/period.ts";
import { SENSORS, formatValue, resolveState } from "../domain/sensors.ts";
import type { SensorDef, SensorState, Severity } from "../domain/sensors.ts";
import type { ReadingsRepository } from "../db/readingsRepository.ts";

export interface AlertDto {
  id: string;
  sensorId: SensorDef["id"];
  severity: Severity;
  title: string;
  message: string;
  at: string;
}

const MAX_ALERTS = 30;
const LOOKBACK_MS = 72 * 3_600_000;

const describe = (def: SensorDef, state: SensorState, value: number): Pick<AlertDto, "title" | "message"> => ({
  title: `${def.title}: ${state.label.toLowerCase()}`,
  message: `Registrado ${formatValue(def, value)} (${state.range}).`,
});

const alertsFor = (def: SensorDef, repository: ReadingsRepository, now: Date): AlertDto[] => {
  const window = { from: now.getTime() - LOOKBACK_MS, to: now.getTime() + 1 };
  const alerts: AlertDto[] = [];
  let previous: SensorState | null = null;

  for (const { key, value } of repository.bucketAverages(def.id, window, "hour")) {
    const state = resolveState(def, value);
    if (state.alert && state !== previous) {
      const at = bucketStart(key, "hour");
      alerts.push({ id: `${def.id}-${at.getTime()}`, sensorId: def.id, severity: state.alert, at: at.toISOString(), ...describe(def, state, value) });
    }
    previous = state;
  }
  return alerts;
};

export const createAlertsService = (repository: ReadingsRepository) => ({
  list(now = new Date()): AlertDto[] {
    return SENSORS.flatMap((def) => alertsFor(def, repository, now))
      .sort((a, b) => b.at.localeCompare(a.at))
      .slice(0, MAX_ALERTS);
  },
});
