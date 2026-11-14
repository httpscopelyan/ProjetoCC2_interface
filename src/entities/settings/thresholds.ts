import type { SensorDef, SensorId, SensorState } from "../../shared/config/sensors";
import { formatNumber } from "../sensor/states";

export type Thresholds = Partial<Record<SensorId, number[]>>;

const isBanded = (state: SensorState) => !state.when && Number.isFinite(state.max);

export const defaultEdges = (def: SensorDef): number[] => def.states.filter(isBanded).map((state) => state.max);

const withUnit = (def: SensorDef, value: number) =>
  `${formatNumber(def, value)}${def.unit === "%" ? "" : " "}${def.unit}`;

const rangeLabel = (def: SensorDef, edges: number[], bandIndex: number) => {
  const number = (value: number) => formatNumber(def, value);
  if (bandIndex === 0) return `abaixo de ${withUnit(def, edges[0])}`;
  if (bandIndex === edges.length) return `acima de ${withUnit(def, edges[edges.length - 1])}`;
  return `${number(edges[bandIndex - 1])} a ${withUnit(def, edges[bandIndex])}`;
};

export const applyThresholds = (def: SensorDef, thresholds: Thresholds): SensorDef => {
  const edges = thresholds[def.id];
  if (!edges) return def;

  let bandIndex = 0;
  const states = def.states.map((state) => {
    if (state.when) return state;
    const current = bandIndex++;
    const max = current < edges.length ? edges[current] : state.max;
    return { ...state, max, range: rangeLabel(def, edges, current) };
  });
  return { ...def, states };
};

export const isAscending = (edges: number[]) => edges.every((edge, i) => i === 0 || edge > edges[i - 1]);
