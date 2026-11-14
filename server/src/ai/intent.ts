import { SENSORS } from "../domain/sensors.ts";
import type { SensorDef } from "../domain/sensors.ts";

export type Metric = "now" | "stats" | "trend" | "compare" | "summary" | "forecast";
export type Range = "today" | "week" | "month";

export interface Intent {
  sensor: SensorDef | null;
  metric: Metric;
  range: Range;
  unsupportedTopic: string | null;
}

const UNSUPPORTED_TOPICS = ["vento", "neve", "granizo", "radiacao", "uv"];

export const normalize = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const hasWord = (text: string, word: string): boolean => new RegExp(`(^|[^a-z0-9])${word}([^a-z0-9]|$)`).test(text);

const matches = (text: string, pattern: RegExp): boolean => pattern.test(text);

const earliestMention = (text: string, words: string[]): number => {
  const positions = words.map((word) => text.search(new RegExp(`(^|[^a-z0-9])${word}([^a-z0-9]|$)`))).filter((position) => position >= 0);
  return positions.length > 0 ? Math.min(...positions) : -1;
};

export const findSensor = (text: string): SensorDef | null => {
  const mentions = SENSORS.map((sensor) => ({ sensor, position: earliestMention(text, sensor.aliases) })).filter(({ position }) => position >= 0);
  mentions.sort((a, b) => a.position - b.position);
  return mentions[0]?.sensor ?? null;
};

export const findSensors = (text: string): SensorDef[] => SENSORS.filter((sensor) => earliestMention(text, sensor.aliases) >= 0);

const metricOf = (text: string, hasSensor: boolean): Metric => {
  if (matches(text, /vai chover|previsao|amanha|vai ter chuva/)) return "forecast";
  if (matches(text, /ontem|comparad|compar/)) return "compare";
  if (matches(text, /tendencia|subindo|caindo|aumentando|diminuindo|esta variando|mudando/)) return "trend";
  if (matches(text, /minim|maxim|\bmedia\b|\bmedio\b|\bpico\b|\bmaior\b|\bmenor\b|mais (alta|alto|baixa|baixo|quente|fria|frio|forte|fraca)/)) return "stats";
  if (!hasSensor && matches(text, /resumo|geral|todos|tudo|situacao|panorama|como esta o (tempo|dia)/)) return "summary";
  return "now";
};

const rangeOf = (text: string): Range => {
  if (matches(text, /semana|7 dias|sete dias/)) return "week";
  if (matches(text, /\bmes\b|30 dias|trinta dias/)) return "month";
  return "today";
};

export const parseIntent = (question: string): Intent => {
  const text = normalize(question);
  const sensor = findSensor(text);
  return {
    sensor,
    metric: metricOf(text, sensor !== null),
    range: rangeOf(text),
    unsupportedTopic: UNSUPPORTED_TOPICS.find((topic) => hasWord(text, topic)) ?? null,
  };
};
