import type { Readings, SensorId } from "../../shared/config/sensors";
import { ACTIVITIES, evaluateActivity } from "./activities";
import type { VerdictStatus } from "./activities";

export interface Suggestion {
  id: string;
  title: string;
  reason: string;
  status: VerdictStatus;
}

const MAX_SUGGESTIONS = 6;
const STATUSES: VerdictStatus[] = ["go", "caution", "stop"];
const SUGGESTED_ACTIVITIES = 4;

const BUCKET_SIZE: Record<Exclude<SensorId, "rain" | "airQualityRaw">, number> = {
  temperature: 2,
  humidity: 10,
  pressure: 5,
  airQuality: 25,
  luminosity: 20,
};

export const rulesSuggestions = (readings: Readings): Suggestion[] =>
  ACTIVITIES.slice(0, SUGGESTED_ACTIVITIES).map((activity) => ({
    id: activity.id,
    title: activity.title,
    ...evaluateActivity(activity, readings),
  }));

export const buildSuggestionsPrompt = (context: string): string =>
  [
    "Dados dos sensores:",
    context,
    "",
    "Sugira 5 afazeres do dia a dia, variados e interessantes (casa, lazer, saúde, trabalho, passeio), adequados ou desaconselhados para as condições atuais.",
    "Use apenas os dados acima para justificar.",
    'Responda somente JSON: {"items":[{"title":"até 4 palavras","reason":"até 12 palavras citando um dado","status":"go|caution|stop"}]}',
  ].join("\n");

export const isVerdictShape = (item: unknown): item is Omit<Suggestion, "id"> => {
  if (typeof item !== "object" || item === null) return false;
  const { title, reason, status } = item as Record<string, unknown>;
  return (
    typeof title === "string" &&
    typeof reason === "string" &&
    title.trim() !== "" &&
    STATUSES.includes(status as VerdictStatus)
  );
};

export const parseSuggestions = (text: string): Suggestion[] | null => {
  try {
    const items = (JSON.parse(text) as { items?: unknown }).items;
    if (!Array.isArray(items)) return null;
    const valid = items.filter(isVerdictShape).slice(0, MAX_SUGGESTIONS);
    return valid.length > 0 ? valid.map((item, index) => ({ ...item, id: `ai-${index}` })) : null;
  } catch {
    return null;
  }
};

export const readingsBucket = (readings: Readings): string => {
  const parts = Object.entries(BUCKET_SIZE).map(([sensorId, size]) => {
    const value = readings[sensorId as keyof typeof BUCKET_SIZE];
    return value === undefined ? "-" : Math.round(value / size);
  });
  const rain = readings.rain ?? 0;
  return [...parts, rain >= 0.1 ? Math.ceil(rain) : 0].join("|");
};
