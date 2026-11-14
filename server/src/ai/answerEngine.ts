import { addDays, startOfDay } from "../domain/period.ts";
import { formatValue } from "../domain/sensors.ts";
import type { SensorDef } from "../domain/sensors.ts";
import type { ReadingsRepository } from "../db/readingsRepository.ts";
import { answerActivity, findActivity } from "./activities.ts";
import { windowEndingNow } from "./facts.ts";
import type { SensorFacts } from "./facts.ts";
import { findSensor, normalize, parseIntent } from "./intent.ts";
import type { Intent, Range } from "./intent.ts";

interface EngineContext {
  repository: ReadingsRepository;
  facts: SensorFacts[];
  now: Date;
}

const RANGE_START_OFFSET_DAYS: Record<Range, number> = { today: 0, week: -6, month: -29 };
const RANGE_LABEL: Record<Range, string> = { today: "hoje", week: "nos últimos 7 dias", month: "nos últimos 30 dias" };

const SUGGESTION_HINT = "Posso falar de temperatura, umidade, pressão, qualidade do ar, luminosidade e chuva. Tente: “qual a máxima de temperatura hoje?” ou “dê um resumo”.";

const pad = (value: number) => String(value).padStart(2, "0");
const clockOf = (timestamp: number) => `${pad(new Date(timestamp).getHours())}:${pad(new Date(timestamp).getMinutes())}`;
const dayOf = (timestamp: number) => `${pad(new Date(timestamp).getDate())}/${pad(new Date(timestamp).getMonth() + 1)}`;
const whenOf = (timestamp: number, range: Range) => (range === "today" ? `às ${clockOf(timestamp)}` : `em ${dayOf(timestamp)} às ${clockOf(timestamp)}`);

const signed = (def: SensorDef, change: number) => `${change > 0 ? "+" : "−"}${formatValue(def, Math.abs(change))}`;

const describeNow = ({ def, value, state, trend }: SensorFacts): string =>
  `${def.title} agora: ${formatValue(def, value)} (${state.label})${trend ? `, ${trend}` : ""}.`;

const answerStats = ({ def }: SensorFacts, range: Range, { repository, now }: EngineContext): string => {
  const start = addDays(startOfDay(now), RANGE_START_OFFSET_DAYS[range]);
  const window = windowEndingNow(now, start);
  const aggregate = repository.aggregate(def.id, window);
  const extremes = repository.extremes(def.id, window);
  if (!aggregate || !extremes) return `Não há leituras de ${def.title.toLowerCase()} ${RANGE_LABEL[range]}.`;
  const { lowest, highest } = extremes;
  return `${def.title} ${RANGE_LABEL[range]}: mínima ${formatValue(def, lowest.value)} (${whenOf(lowest.at, range)}), máxima ${formatValue(def, highest.value)} (${whenOf(highest.at, range)}) e média ${formatValue(def, aggregate.avg)}.`;
};

const answerTrend = (fact: SensorFacts): string =>
  fact.trend
    ? `${fact.def.title} está ${fact.trend}: agora em ${formatValue(fact.def, fact.value)} (${fact.state.label}).`
    : `Ainda não há leituras suficientes para dizer a tendência de ${fact.def.title.toLowerCase()}.`;

const answerCompare = ({ def, today, yesterdayAverage }: SensorFacts): string => {
  if (!today || yesterdayAverage === null) return `Não tenho leituras suficientes de hoje e de ontem para comparar ${def.title.toLowerCase()}.`;
  const change = today.avg - yesterdayAverage;
  if (Math.abs(change) < def.noticeableChange) return `${def.title} hoje (média ${formatValue(def, today.avg)}) está parecida com a de ontem (${formatValue(def, yesterdayAverage)}).`;
  return `${def.title} hoje tem média de ${formatValue(def, today.avg)}, ${signed(def, change)} em relação a ontem (${formatValue(def, yesterdayAverage)}).`;
};

export const answerSummary = (facts: SensorFacts[]): string =>
  facts.length === 0
    ? "Ainda não recebi leituras dos sensores."
    : `Agora: ${facts.map(({ def, value, state }) => `${def.title.toLowerCase()} ${formatValue(def, value)} (${state.label.toLowerCase()})`).join("; ")}.`;

const answerForecast = (facts: SensorFacts[]): string => {
  const rain = facts.find(({ def }) => def.id === "rain");
  const pressure = facts.find(({ def }) => def.id === "pressure");
  const observations = [rain && describeNow(rain), pressure && describeNow(pressure)].filter(Boolean).join(" ");
  const hint = pressure?.trend === "caindo" ? " Pressão em queda costuma anteceder chuva." : "";
  return `Não faço previsão do tempo; só uso o que os sensores registraram. ${observations}${hint}`.trim();
};

const answerFor = (intent: Intent, fact: SensorFacts | undefined, context: EngineContext): string | null => {
  if (intent.metric === "summary") return answerSummary(context.facts);
  if (intent.metric === "forecast") return answerForecast(context.facts);
  if (!intent.sensor) return null;
  if (!fact) return `Ainda não recebi leituras de ${intent.sensor.title.toLowerCase()}.`;
  switch (intent.metric) {
    case "stats":
      return answerStats(fact, intent.range, context);
    case "trend":
      return answerTrend(fact);
    case "compare":
      return answerCompare(fact);
    default:
      return describeNow(fact);
  }
};

const inheritSensor = (intent: Intent, previousQuestions: string[]): Intent => {
  if (intent.sensor || intent.metric === "summary" || intent.metric === "forecast") return intent;
  const sensor = previousQuestions.map((question) => findSensor(normalize(question))).find((found) => found !== null) ?? null;
  return sensor ? { ...intent, sensor } : intent;
};

export const answerQuestion = (question: string, previousQuestions: string[], context: EngineContext): string | null => {
  const activity = findActivity(normalize(question));
  if (activity) return answerActivity(activity, context.facts);
  const intent = inheritSensor(parseIntent(question), previousQuestions);
  if (intent.unsupportedTopic) return `Não tenho sensor de ${intent.unsupportedTopic}. ${SUGGESTION_HINT}`;
  const fact = context.facts.find(({ def }) => def.id === intent.sensor?.id);
  return answerFor(intent, fact, context);
};

export const unknownQuestionReply = SUGGESTION_HINT;
