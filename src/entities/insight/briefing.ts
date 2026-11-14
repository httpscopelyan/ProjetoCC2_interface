import type { SensorId } from "../../shared/config/sensors";
import type { SeriesPoint } from "../sensor/model";
import { mean } from "../sensor/states";

export type DaySeries = Partial<Record<SensorId, SeriesPoint[]>>;

const TEMPERATURE_NOTICEABLE_DELTA = 0.5;
const PRESSURE_TREND_DELTA = 3;
const RAINING_THRESHOLD = 0.1;
const POOR_AIR_QUALITY = 100;

const decimal = (value: number) => value.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const hourOf = (point: SeriesPoint) => `${new Date(point.at).getHours()}h`;

const temperatureSentence = (today: SeriesPoint[], yesterday: SeriesPoint[]): string | null => {
  if (today.length === 0 || yesterday.length === 0) return null;
  const delta = mean(today) - mean(yesterday);
  if (Math.abs(delta) < TEMPERATURE_NOTICEABLE_DELTA) return "A temperatura está parecida com a de ontem.";
  return `Hoje está ${decimal(Math.abs(delta))} °C mais ${delta > 0 ? "quente" : "frio"} que ontem.`;
};

const pressureSentence = (today: SeriesPoint[]): string | null => {
  if (today.length < 2) return null;
  const change = today[today.length - 1].value - today[0].value;
  if (change <= -PRESSURE_TREND_DELTA) return `Queda de pressão de ${decimal(Math.abs(change))} hPa sugere chuva.`;
  if (change >= PRESSURE_TREND_DELTA) return `Alta de pressão de ${decimal(change)} hPa indica tempo firme.`;
  return null;
};

const rainSentence = (today: SeriesPoint[]): string | null => {
  if (today.length === 0) return null;
  const rainyPoints = today.filter((point) => point.value >= RAINING_THRESHOLD);
  if (rainyPoints.length === 0) return "Não choveu até agora.";
  const peak = Math.max(...rainyPoints.map((point) => point.value));
  return `Choveu por ${rainyPoints.length} h, com pico de ${decimal(peak)} mm/h.`;
};

const airQualitySentence = (today: SeriesPoint[]): string | null => {
  const worst = today.reduce<SeriesPoint | null>((acc, point) => (!acc || point.value > acc.value ? point : acc), null);
  return worst && worst.value > POOR_AIR_QUALITY ? `O ar ficou ruim por volta das ${hourOf(worst)}.` : null;
};

export const buildBriefing = (today: DaySeries, yesterday: DaySeries): string => {
  const sentences = [
    temperatureSentence(today.temperature ?? [], yesterday.temperature ?? []),
    pressureSentence(today.pressure ?? []),
    rainSentence(today.rain ?? []),
    airQualitySentence(today.airQuality ?? []),
  ].filter((sentence): sentence is string => sentence !== null);

  return sentences.length > 0 ? sentences.join(" ") : "Ainda não há medições suficientes para o resumo de hoje.";
};

export const buildBriefingPrompt = (facts: string): string =>
  `Reescreva como um briefing diário curto e natural, em português, sem inventar dados: ${facts}`;
