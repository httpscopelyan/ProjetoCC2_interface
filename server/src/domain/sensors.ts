export type SensorId = "temperature" | "humidity" | "pressure" | "airQuality" | "luminosity" | "rain";
export type Severity = "info" | "warning" | "critical";

export interface SensorState {
  max: number;
  label: string;
  range: string;
  alert?: Severity;
}

export interface SensorDef {
  id: SensorId;
  title: string;
  unit: string;
  decimals: number;
  aliases: string[];
  validRange: [min: number, max: number];
  noticeableChange: number;
  states: SensorState[];
}

export const SENSORS: SensorDef[] = [
  {
    id: "temperature",
    title: "Temperatura",
    unit: "°C",
    decimals: 1,
    aliases: ["temperatura", "temp", "calor", "frio"],
    validRange: [-40, 60],
    noticeableChange: 0.5,
    states: [
      { max: 16, label: "Frio", range: "abaixo de 16 °C", alert: "info" },
      { max: 24, label: "Agradável", range: "16 a 24 °C" },
      { max: 29, label: "Quente", range: "24 a 29 °C" },
      { max: Infinity, label: "Muito quente", range: "acima de 29 °C", alert: "warning" },
    ],
  },
  {
    id: "humidity",
    title: "Umidade",
    unit: "%",
    decimals: 0,
    aliases: ["umidade", "umido", "seco"],
    validRange: [0, 100],
    noticeableChange: 3,
    states: [
      { max: 30, label: "Seco", range: "abaixo de 30%", alert: "warning" },
      { max: 60, label: "Confortável", range: "30 a 60%" },
      { max: 80, label: "Úmido", range: "60 a 80%" },
      { max: Infinity, label: "Saturado", range: "acima de 80%", alert: "info" },
    ],
  },
  {
    id: "pressure",
    title: "Pressão",
    unit: "hPa",
    decimals: 0,
    aliases: ["pressao", "atmosferica", "barometro"],
    validRange: [800, 1100],
    noticeableChange: 1,
    states: [
      { max: 1000, label: "Baixa", range: "abaixo de 1000 hPa", alert: "info" },
      { max: 1020, label: "Normal", range: "1000 a 1020 hPa" },
      { max: Infinity, label: "Alta", range: "acima de 1020 hPa", alert: "info" },
    ],
  },
  {
    id: "airQuality",
    title: "Qualidade do ar",
    unit: "AQI",
    decimals: 0,
    aliases: ["qualidade do ar", "poluicao", "ar esta", "o ar"],
    validRange: [0, 500],
    noticeableChange: 5,
    states: [
      { max: 50, label: "Boa", range: "abaixo de 50" },
      { max: 100, label: "Moderada", range: "50 a 100", alert: "info" },
      { max: Infinity, label: "Ruim", range: "acima de 100", alert: "critical" },
    ],
  },
  {
    id: "luminosity",
    title: "Luminosidade",
    unit: "%",
    decimals: 0,
    aliases: ["luminosidade", "luz", "claridade", "sol"],
    validRange: [0, 100],
    noticeableChange: 5,
    states: [
      { max: 5, label: "Noite", range: "abaixo de 5%" },
      { max: 25, label: "Crepúsculo", range: "5 a 25%" },
      { max: 70, label: "Nublado", range: "25 a 70%" },
      { max: Infinity, label: "Sol forte", range: "acima de 70%" },
    ],
  },
  {
    id: "rain",
    title: "Chuva",
    unit: "mm/h",
    decimals: 1,
    aliases: ["chuva", "chovendo", "chover", "choveu", "chuvoso", "garoa"],
    validRange: [0, 500],
    noticeableChange: 0.5,
    states: [
      { max: 0.1, label: "Sem chuva", range: "abaixo de 0,1 mm/h" },
      { max: 2, label: "Garoa", range: "0,1 a 2 mm/h", alert: "info" },
      { max: 10, label: "Chuva", range: "2 a 10 mm/h", alert: "warning" },
      { max: Infinity, label: "Tempestade", range: "acima de 10 mm/h", alert: "critical" },
    ],
  },
];

export const SENSOR_IDS = SENSORS.map((sensor) => sensor.id);

export const SENSOR_BY_ID = Object.fromEntries(SENSORS.map((sensor) => [sensor.id, sensor])) as Record<SensorId, SensorDef>;

export const isSensorId = (value: string): value is SensorId => value in SENSOR_BY_ID;

export const resolveState = (def: SensorDef, value: number): SensorState =>
  def.states.find((state) => value < state.max) ?? def.states[def.states.length - 1];

export const formatValue = (def: SensorDef, value: number): string => {
  const number = value.toLocaleString("pt-BR", { minimumFractionDigits: def.decimals, maximumFractionDigits: def.decimals });
  return `${number}${def.unit === "%" ? "" : " "}${def.unit}`;
};
