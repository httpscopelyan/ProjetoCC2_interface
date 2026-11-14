import { bucketStart } from "../domain/period.ts";
import type { ReadingsRepository } from "../db/readingsRepository.ts";
import type { AiConfig } from "./aiConfig.ts";
import { collectFacts, factsToContext } from "./facts.ts";
import type { SensorFacts } from "./facts.ts";
import { findSensors, normalize } from "./intent.ts";

const HOUR_MS = 3_600_000;

const hourLabel = (key: string): string => `${String(bucketStart(key, "hour").getHours()).padStart(2, "0")}h`;

const plainNumber = (def: SensorFacts["def"], value: number): string => value.toLocaleString("pt-BR", { minimumFractionDigits: def.decimals, maximumFractionDigits: def.decimals });

const describeHistory = ({ def }: SensorFacts, repository: ReadingsRepository, now: Date, hours: number): string => {
  const end = now.getTime() + 1;
  const buckets = repository.bucketAverages(def.id, { from: end - hours * HOUR_MS, to: end }, "hour");
  return buckets.length === 0 ? "" : `${def.title} (${def.unit}): ${buckets.map(({ key, value }) => `${hourLabel(key)} ${plainNumber(def, value)}`).join("; ")}`;
};

export interface AiContext {
  facts: SensorFacts[];
  text: string;
}

export const buildAiContext = (repository: ReadingsRepository, config: AiConfig, now = new Date(), question = ""): AiContext => {
  const facts = collectFacts(repository, now).filter(({ def }) => config.sensors.includes(def.id));
  const focus = findSensors(normalize(question)).map(({ id }) => id);
  const historyFacts = facts.filter(({ def }) => focus.includes(def.id));
  const lines = (items: string[]) => items.join("\n");
  const sections = [
    config.notes.length > 0 ? `Observações:\n${lines(config.notes.map((note) => `- ${note}`))}` : "",
    `Leituras atuais dos sensores:\n${factsToContext(facts)}`,
    config.historyHours > 0 && historyFacts.length > 0 ? `Histórico das últimas ${config.historyHours} h (média por hora):\n${lines(historyFacts.map((fact) => describeHistory(fact, repository, now, config.historyHours)).filter(Boolean))}` : "",
    `Hora atual: ${now.toLocaleString("pt-BR")}`,
  ];
  return { facts, text: sections.filter(Boolean).join("\n\n") };
};
