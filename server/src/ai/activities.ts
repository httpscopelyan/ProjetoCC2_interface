import { formatValue, SENSOR_BY_ID } from "../domain/sensors.ts";
import type { SensorId } from "../domain/sensors.ts";
import type { SensorFacts } from "./facts.ts";

type Readings = Record<Extract<SensorId, "temperature" | "humidity" | "airQuality" | "luminosity" | "rain">, number>;
type Status = "go" | "caution" | "stop";

interface Rule {
  applies: (readings: Readings) => boolean;
  reason: string;
}

interface Activity {
  title: string;
  keywords: string[];
  stop: Rule[];
  caution: Rule[];
  allGood: string;
}

const NEUTRAL_READINGS: Readings = { temperature: 22, humidity: 50, airQuality: 0, luminosity: 50, rain: 0 };
const RAIN_THRESHOLD = 0.1;

const raining: Rule = { applies: (r) => r.rain >= RAIN_THRESHOLD, reason: "está chovendo" };
const pollutedAir: Rule = { applies: (r) => r.airQuality > 100, reason: "a qualidade do ar está ruim" };

const ACTIVITIES: Activity[] = [
  {
    title: "Secar roupa",
    keywords: ["varal", "estender", "secar roupa", "secar a roupa", "roupa secar", "roupa seca", "roupas secar"],
    stop: [raining, { applies: (r) => r.humidity >= 80, reason: "o ar está muito úmido e a roupa não seca" }],
    caution: [{ applies: (r) => r.humidity >= 65 || r.luminosity < 25, reason: "vai secar devagar" }],
    allGood: "ar seco e com luz suficiente",
  },
  {
    title: "Correr",
    keywords: ["correr", "corrida", "caminhar", "caminhada", "treino", "treinar", "exercicio"],
    stop: [raining, pollutedAir, { applies: (r) => r.temperature > 32 || r.temperature < 5, reason: "a temperatura está extrema" }],
    caution: [{ applies: (r) => r.temperature > 28 || r.airQuality > 50, reason: "hidrate-se e reduza o ritmo" }],
    allGood: "clima e ar favoráveis",
  },
  {
    title: "Abrir as janelas",
    keywords: ["janela", "ventilar", "arejar"],
    stop: [raining, { applies: (r) => r.airQuality > 100, reason: "o ar de fora está poluído" }],
    caution: [{ applies: (r) => r.airQuality > 50 || r.humidity >= 80, reason: "ventile por pouco tempo" }],
    allGood: "boa hora para ventilar",
  },
  {
    title: "Lavar o carro",
    keywords: ["carro", "lavar", "automovel"],
    stop: [raining],
    caution: [
      { applies: (r) => r.humidity >= 85, reason: "pode chover em breve" },
      { applies: (r) => r.luminosity >= 70, reason: "sol forte deixa manchas" },
    ],
    allGood: "sem chuva e sem sol forte",
  },
  {
    title: "Fazer churrasco",
    keywords: ["churrasco", "churrasqueira", "assar"],
    stop: [raining],
    caution: [{ applies: (r) => r.temperature > 34, reason: "calor demais perto da churrasqueira" }],
    allGood: "tempo firme para o churrasco",
  },
  {
    title: "Ir à piscina ou praia",
    keywords: ["praia", "piscina", "banho de sol"],
    stop: [raining, { applies: (r) => r.temperature < 20, reason: "frio demais para a água" }],
    caution: [{ applies: (r) => r.luminosity >= 85, reason: "sol forte, use protetor" }],
    allGood: "calor e sem chuva",
  },
  {
    title: "Passear com o cachorro",
    keywords: ["cachorro", "cao", "pet", "passear"],
    stop: [
      { applies: (r) => r.temperature >= 35, reason: "o chão quente machuca as patas" },
      { applies: (r) => r.rain >= 10, reason: "há tempestade" },
    ],
    caution: [{ applies: (r) => r.temperature >= 30 || r.rain >= RAIN_THRESHOLD, reason: "faça um passeio curto e leve água" }],
    allGood: "clima bom para o passeio",
  },
  {
    title: "Andar de bicicleta",
    keywords: ["bicicleta", "bike", "pedalar"],
    stop: [raining, pollutedAir],
    caution: [{ applies: (r) => r.temperature >= 32, reason: "calor forte" }],
    allGood: "boas condições para pedalar",
  },
  {
    title: "Regar as plantas",
    keywords: ["planta", "regar", "jardim", "horta"],
    stop: [{ applies: (r) => r.rain >= 2, reason: "a chuva já está regando" }],
    caution: [{ applies: (r) => r.luminosity >= 80 && r.temperature >= 28, reason: "no sol forte a água evapora" }],
    allGood: "boa hora para regar",
  },
  {
    title: "Pintar uma parede",
    keywords: ["pintar", "tinta", "parede"],
    stop: [raining],
    caution: [{ applies: (r) => r.humidity >= 75, reason: "a tinta seca devagar com ar úmido" }],
    allGood: "ar seco ajuda a secagem",
  },
];

const VERDICT_LABEL: Record<Status, string> = { go: "Pode", caution: "Com cuidado", stop: "Evite" };

const hasKeyword = (text: string, keyword: string): boolean => new RegExp(`(^|[^a-z0-9])${keyword}`).test(text);

export const findActivity = (normalizedQuestion: string): Activity | null =>
  ACTIVITIES.find(({ keywords }) => keywords.some((keyword) => hasKeyword(normalizedQuestion, keyword))) ?? null;

const readingsFrom = (facts: SensorFacts[]): Readings => {
  const readings = { ...NEUTRAL_READINGS };
  for (const { def, value } of facts) if (def.id in readings) readings[def.id as keyof Readings] = value;
  return readings;
};

const verdictOf = (activity: Activity, readings: Readings): { status: Status; reason: string } => {
  const blocker = activity.stop.find((rule) => rule.applies(readings));
  if (blocker) return { status: "stop", reason: blocker.reason };
  const warning = activity.caution.find((rule) => rule.applies(readings));
  return warning ? { status: "caution", reason: warning.reason } : { status: "go", reason: activity.allGood };
};

const CONTEXT_SENSORS: SensorId[] = ["temperature", "humidity", "rain"];

export const answerActivity = (activity: Activity, facts: SensorFacts[]): string => {
  const { status, reason } = verdictOf(activity, readingsFrom(facts));
  const now = facts
    .filter(({ def }) => CONTEXT_SENSORS.includes(def.id))
    .map(({ def, value }) => `${SENSOR_BY_ID[def.id].title.toLowerCase()} ${formatValue(def, value)}`)
    .join(", ");
  return `${activity.title}: ${VERDICT_LABEL[status]} — ${reason}.${now ? ` Agora: ${now}.` : ""}`;
};
