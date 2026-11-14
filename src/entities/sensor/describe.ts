import type { Readings, SensorDef } from "../../shared/config/sensors";
import { formatValue, resolveState } from "./states";

export const describeSensor = (def: SensorDef, value: number, all: Readings): string =>
  `${def.title}: ${formatValue(def, value)}, ${resolveState(def, value, all).state.label.toLowerCase()}.`;

export const describeReadings = (defs: SensorDef[], readings: Readings): string =>
  defs
    .filter((def) => readings[def.id] !== undefined)
    .map((def) => describeSensor(def, readings[def.id] as number, readings))
    .join(" ");
