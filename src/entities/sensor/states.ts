import { mixHex } from "../../shared/lib/color";
import type { Readings, SensorDef, SensorState } from "../../shared/config/sensors";
import type { SeriesPoint } from "./model";

export interface ResolvedState {
  state: SensorState;
  index: number;
}

export const resolveState = (def: SensorDef, value: number, all: Readings): ResolvedState => {
  for (let index = 0; index < def.states.length; index++) {
    const state = def.states[index];
    if (state.when && !state.when(all)) continue;
    if (value < state.max) return { state, index };
  }
  const index = def.states.length - 1;
  return { state: def.states[index], index };
};

const bandCenters = (def: SensorDef, bands: SensorState[]) => {
  const edges = bands.slice(0, -1).map((band) => band.max);
  const firstWidth = edges.length > 1 ? edges[1] - edges[0] : Math.abs(edges[0]) || 1;
  const lows = bands.map((_, i) => (i === 0 ? (def.floor ?? edges[0] - firstWidth) : edges[i - 1]));
  const last = bands.length - 1;
  const highs = bands.map((_, i) => (i < last ? edges[i] : edges[last - 1] + (edges[last - 1] - lows[last])));
  return bands.map((_, i) => (lows[i] + highs[i]) / 2);
};

export const stateColor = (def: SensorDef, value: number, all: Readings): string => {
  const { state } = resolveState(def, value, all);
  if (state.when) return state.color;

  const bands = def.states.filter((band) => !band.when);
  const centers = bandCenters(def, bands);
  const last = bands.length - 1;
  if (value <= centers[0]) return bands[0].color;
  if (value >= centers[last]) return bands[last].color;

  const i = centers.findIndex((center, idx) => idx < last && value >= center && value < centers[idx + 1]);
  const t = (value - centers[i]) / (centers[i + 1] - centers[i]);
  return mixHex(bands[i].color, bands[i + 1].color, t);
};

export const changePct = (points: SeriesPoint[]): number => {
  if (points.length < 2) return 0;
  const first = points[0].value;
  if (first === 0) return 0;
  return Math.round(((points[points.length - 1].value - first) / Math.abs(first)) * 100);
};

export const mean = (points: SeriesPoint[]): number =>
  points.length === 0 ? 0 : points.reduce((sum, p) => sum + p.value, 0) / points.length;

export const formatNumber = (def: SensorDef, value: number) =>
  value.toLocaleString("pt-BR", { minimumFractionDigits: def.decimals, maximumFractionDigits: def.decimals });

export const formatValue = (def: SensorDef, value: number) =>
  `${formatNumber(def, value)}${def.unit === "%" ? "" : " "}${def.unit}`;
