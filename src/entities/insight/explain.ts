import type { Readings, SensorDef, SensorId } from "../../shared/config/sensors";
import type { SensorSeries } from "../sensor/model";
import { formatValue, resolveState } from "../sensor/states";

interface Relation {
  other: SensorId;
  labels: string[];
  phrase: string;
}

const RELATIONS: Record<SensorId, Relation[]> = {
  temperature: [
    { other: "luminosity", labels: ["Claro", "Muito claro"], phrase: "a luz intensa aquece o ambiente" },
    { other: "rain", labels: ["Garoa", "Chuva", "Tempestade"], phrase: "a chuva costuma esfriar o ar" },
    { other: "humidity", labels: ["Seco"], phrase: "o ar seco aquece e esfria mais rápido" },
  ],
  humidity: [
    { other: "rain", labels: ["Garoa", "Chuva", "Tempestade"], phrase: "a chuva eleva a umidade do ar" },
    { other: "temperature", labels: ["Quente", "Muito quente"], phrase: "o calor reduz a umidade relativa" },
  ],
  pressure: [
    { other: "rain", labels: ["Garoa", "Chuva", "Tempestade"], phrase: "pressão baixa costuma acompanhar chuva" },
    { other: "temperature", labels: ["Muito quente"], phrase: "ar quente e leve reduz a pressão" },
  ],
  airQuality: [
    { other: "rain", labels: ["Garoa", "Chuva", "Tempestade"], phrase: "a chuva limpa o ar" },
    { other: "humidity", labels: ["Saturado"], phrase: "ar úmido e parado retém poluentes" },
  ],
  airQualityRaw: [],
  luminosity: [
    { other: "rain", labels: ["Garoa", "Chuva", "Tempestade"], phrase: "nuvens de chuva reduzem a luz" },
    { other: "humidity", labels: ["Saturado"], phrase: "céu carregado reduz a luz" },
  ],
  rain: [
    { other: "pressure", labels: ["Baixa"], phrase: "a pressão baixa favorece chuva" },
    { other: "humidity", labels: ["Úmido", "Saturado"], phrase: "a umidade alta indica ar carregado" },
    { other: "luminosity", labels: ["Escuro", "Penumbra"], phrase: "o céu estava fechado" },
  ],
};

export const readingsAt = (seriesBySensor: Partial<Record<SensorId, SensorSeries>>, at: string): Readings =>
  Object.fromEntries(
    Object.entries(seriesBySensor).flatMap(([sensorId, series]) => {
      const point = series?.points.find((candidate) => candidate.at === at);
      return point ? [[sensorId, point.value]] : [];
    }),
  );

const findCauses = (target: SensorId, defsById: Record<SensorId, SensorDef>, readings: Readings): string[] =>
  RELATIONS[target].filter(({ other, labels }) => {
    const value = readings[other];
    return value !== undefined && labels.includes(resolveState(defsById[other], value, readings).state.label);
  }).map(({ phrase }) => phrase);

export const explainLocally = (def: SensorDef, defsById: Record<SensorId, SensorDef>, readings: Readings): string => {
  const value = readings[def.id];
  if (value === undefined) return "Sem dados deste sensor nesse instante.";

  const { label } = resolveState(def, value, readings).state;
  const summary = `${def.title} em ${formatValue(def, value)} (${label.toLowerCase()}).`;
  const causes = findCauses(def.id, defsById, readings);
  return causes.length > 0
    ? `${summary} Fatores cruzados: ${causes.join("; ")}.`
    : `${summary} Nenhum outro sensor aponta uma causa clara.`;
};

export const buildExplainPrompt = (def: SensorDef, defs: SensorDef[], at: string, readings: Readings): string => {
  const snapshot = defs
    .filter((candidate) => readings[candidate.id] !== undefined)
    .map((candidate) => `${candidate.title}: ${formatValue(candidate, readings[candidate.id] as number)}`)
    .join("; ");
  return `Explique em até duas frases, em português, o que aconteceu com ${def.title} em ${new Date(at).toLocaleString("pt-BR")}, cruzando os sensores. Leituras no mesmo instante: ${snapshot}.`;
};
