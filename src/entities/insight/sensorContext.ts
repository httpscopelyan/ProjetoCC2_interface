import type { Readings, SensorDef, SensorId } from "../../shared/config/sensors";
import type { SensorSeries } from "../sensor/model";
import { formatValue, mean, resolveState } from "../sensor/states";

type SeriesBySensor = Partial<Record<SensorId, SensorSeries>>;

const describeStats = (def: SensorDef, series?: SensorSeries): string => {
  const points = series?.points ?? [];
  if (points.length === 0) return "";
  const values = points.map((point) => point.value);
  return `; no período: mín ${formatValue(def, Math.min(...values))}, média ${formatValue(def, mean(points))}, máx ${formatValue(def, Math.max(...values))}`;
};

export const buildSensorContext = (defs: SensorDef[], live: Readings, seriesBySensor: SeriesBySensor): string =>
  defs
    .filter((def) => live[def.id] !== undefined)
    .map((def) => {
      const value = live[def.id] as number;
      const { label } = resolveState(def, value, live).state;
      return `- ${def.title}: ${formatValue(def, value)} (${label})${describeStats(def, seriesBySensor[def.id])}`;
    })
    .join("\n");
