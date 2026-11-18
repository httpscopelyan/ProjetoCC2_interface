import type { SensorDef, SensorId } from "../../shared/config/sensors";
import type { SeriesPoint } from "../sensor/model";
import { resolveState } from "../sensor/states";

export interface SensorEvent {
  id: string;
  sensorId: SensorId;
  label: string;
  startAt: string;
  endAt: string;
  peakValue: number;
}

const NOTABLE_LABELS: Record<SensorId, string[]> = {
  temperature: ["Frio", "Muito quente"],
  humidity: ["Seco", "Saturado"],
  pressure: ["Baixa"],
  airQuality: ["Ruim"],
  airQualityRaw: [],
  luminosity: [],
  rain: ["Garoa", "Chuva", "Tempestade"],
};

const DEFAULT_STEP_MS = 60 * 60 * 1000;

const stepBetween = (points: SeriesPoint[]) =>
  points.length > 1 ? new Date(points[1].at).getTime() - new Date(points[0].at).getTime() : DEFAULT_STEP_MS;

const labelOf = (def: SensorDef, point: SeriesPoint) => resolveState(def, point.value, {});

const toEvent = (def: SensorDef, run: SeriesPoint[], label: string, lowSide: boolean, stepMs: number): SensorEvent => {
  const values = run.map((point) => point.value);
  const peakValue = lowSide ? Math.min(...values) : Math.max(...values);
  const endAt = new Date(new Date(run[run.length - 1].at).getTime() + stepMs).toISOString();
  return { id: `${def.id}-${run[0].at}`, sensorId: def.id, label, startAt: run[0].at, endAt, peakValue };
};

export const buildEvents = (def: SensorDef, points: SeriesPoint[]): SensorEvent[] => {
  const notable = NOTABLE_LABELS[def.id];
  const stepMs = stepBetween(points);
  const events: SensorEvent[] = [];
  let run: SeriesPoint[] = [];
  let runLabel = "";
  let runLowSide = false;

  const closeRun = () => {
    if (run.length > 0) events.push(toEvent(def, run, runLabel, runLowSide, stepMs));
    run = [];
  };

  for (const point of points) {
    const { state, index } = labelOf(def, point);
    const isNotable = notable.includes(state.label);
    if (!isNotable || state.label !== runLabel) closeRun();
    if (!isNotable) continue;
    runLabel = state.label;
    runLowSide = index === 0;
    run.push(point);
  }
  closeRun();

  return events;
};
