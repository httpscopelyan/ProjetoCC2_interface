import type { Readings, SensorDef } from "../../shared/config/sensors";
import { ACTIVITIES, evaluateActivity, evaluateGeneric } from "./activities";
import type { Activity } from "./activities";
import { isVerdictShape } from "./suggestions";
import type { Suggestion } from "./suggestions";

export const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

const NUMBER = "(-?\\d+(?:[.,]\\d+)?)";
const toNumber = (raw: string) => Number(raw.replace(",", "."));

const OVERRIDE_PATTERNS: Array<{ key: keyof Readings; pattern: RegExp }> = [
  { key: "temperature", pattern: new RegExp(`${NUMBER}\\s*(?:graus?|°c?|ºc?)`) },
  { key: "humidity", pattern: new RegExp(`${NUMBER}\\s*%|umidade\\s*(?:de|em|a)?\\s*${NUMBER}`) },
  { key: "rain", pattern: new RegExp(`${NUMBER}\\s*mm`) },
  { key: "airQuality", pattern: new RegExp(`(?:aqi|qualidade do ar|poluicao)\\s*(?:de|em|a)?\\s*${NUMBER}`) },
];

const DEFAULT_RAIN_WHEN_MENTIONED = 5;

export const extractOverrides = (query: string): Readings => {
  const text = normalizeText(query);
  const overrides: Readings = {};

  for (const { key, pattern } of OVERRIDE_PATTERNS) {
    const match = pattern.exec(text);
    const raw = match?.slice(1).find((group) => group !== undefined);
    if (raw !== undefined) overrides[key] = toNumber(raw);
  }

  if (overrides.rain === undefined && /\b(chovendo|com chuva|chuva forte)\b/.test(text)) {
    overrides.rain = DEFAULT_RAIN_WHEN_MENTIONED;
  }
  if (/\bsem chuva\b/.test(text)) overrides.rain = 0;
  return overrides;
};

export const findActivity = (query: string): Activity | undefined => {
  const text = normalizeText(query);
  return ACTIVITIES.find((activity) =>
    [activity.title, ...activity.keywords].some((keyword) => text.includes(normalizeText(keyword))),
  );
};

export const answerLocally = (query: string, readings: Readings): Suggestion => {
  const activity = findActivity(query);
  const verdict = activity ? evaluateActivity(activity, readings) : evaluateGeneric(readings);
  return { id: "scenario", title: activity?.title ?? query.trim(), ...verdict };
};

export const describeOverrides = (defs: SensorDef[], overrides: Readings): string[] =>
  defs
    .filter((def) => overrides[def.id] !== undefined)
    .map((def) => `${def.title}: ${overrides[def.id]} ${def.unit}`);

export const buildScenarioPrompt = (query: string, context: string, simulated: string[]): string =>
  [
    "Dados dos sensores (valores reais):",
    context,
    simulated.length > 0 ? `\nO usuário pediu para simular: ${simulated.join("; ")}. Use esses valores no lugar dos reais.` : "",
    `\nPergunta do usuário: "${query}"`,
    'Responda somente JSON: {"title":"até 5 palavras","reason":"até 20 palavras citando um dado","status":"go|caution|stop"}',
  ].join("\n");

export const parseScenarioVerdict = (text: string): Suggestion | null => {
  try {
    const parsed: unknown = JSON.parse(text);
    return isVerdictShape(parsed) ? { ...parsed, id: "scenario" } : null;
  } catch {
    return null;
  }
};
