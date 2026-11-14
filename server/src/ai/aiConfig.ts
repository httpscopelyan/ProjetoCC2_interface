import { readFileSync, statSync } from "node:fs";
import { SENSOR_IDS, isSensorId } from "../domain/sensors.ts";
import type { SensorId } from "../domain/sensors.ts";

export interface AiConfig {
  systemPrompt: string;
  sensors: SensorId[];
  historyHours: number;
  notes: string[];
  rulesFirst: boolean;
  maxReplyTokens: number;
}

const CONFIG_PATH = "ai.config.json";

const DEFAULTS: AiConfig = {
  systemPrompt: "Você é o assistente de uma estação meteorológica. Use somente os dados informados e responda em português, de forma curta.",
  sensors: SENSOR_IDS,
  historyHours: 24,
  notes: [],
  rulesFirst: true,
  maxReplyTokens: 220,
};

const parse = (raw: Partial<Record<keyof AiConfig, unknown>>): AiConfig => ({
  systemPrompt: typeof raw.systemPrompt === "string" && raw.systemPrompt ? raw.systemPrompt : DEFAULTS.systemPrompt,
  sensors: Array.isArray(raw.sensors) ? raw.sensors.filter((id): id is SensorId => typeof id === "string" && isSensorId(id)) : DEFAULTS.sensors,
  historyHours: typeof raw.historyHours === "number" ? Math.min(Math.max(Math.floor(raw.historyHours), 0), 72) : DEFAULTS.historyHours,
  notes: Array.isArray(raw.notes) ? raw.notes.filter((note): note is string => typeof note === "string") : DEFAULTS.notes,
  rulesFirst: typeof raw.rulesFirst === "boolean" ? raw.rulesFirst : DEFAULTS.rulesFirst,
  maxReplyTokens: typeof raw.maxReplyTokens === "number" ? raw.maxReplyTokens : DEFAULTS.maxReplyTokens,
});

let cached: { modifiedAt: number; config: AiConfig } | null = null;

export const loadAiConfig = (): AiConfig => {
  try {
    const modifiedAt = statSync(CONFIG_PATH).mtimeMs;
    if (cached?.modifiedAt === modifiedAt) return cached.config;
    cached = { modifiedAt, config: parse(JSON.parse(readFileSync(CONFIG_PATH, "utf8"))) };
    return cached.config;
  } catch (error) {
    console.warn(`[ia] não consegui ler ${CONFIG_PATH}, usando padrões:`, (error as Error).message);
    return cached?.config ?? DEFAULTS;
  }
};
