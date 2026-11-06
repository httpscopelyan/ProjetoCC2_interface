import {
  Bubbles,
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudRainWind,
  CloudSun,
  Droplet,
  Droplets,
  Gauge,
  Moon,
  Sun,
  Sunset,
  Thermometer,
  ThermometerSnowflake,
  ThermometerSun,
  Wind,
  WindArrowDown,
  WindArrowUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SensorId = "temperature" | "humidity" | "pressure" | "airQuality" | "luminosity" | "rain";
export type Period = "now" | "week" | "month" | "year";

export type Readings = Partial<Record<SensorId | "windSpeed", number>>;

export interface SensorState {
  max: number;
  icon: LucideIcon;
  color: string;
  label: string;
  range: string;
  when?: (all: Readings) => boolean;
}

export interface SensorDef {
  id: SensorId;
  title: string;
  icon: LucideIcon;
  unit: string;
  decimals: number;
  floor?: number;
  states: SensorState[];
  help: string;
  aliases: string[];
}

export const SENSOR_DEFS: SensorDef[] = [
  {
    id: "temperature",
    title: "Temperatura",
    icon: Thermometer,
    unit: "°C",
    decimals: 1,
    help: "O ícone e a cor mudam conforme a temperatura ambiente.",
    aliases: ["temperatura", "temp", "calor", "frio"],
    states: [
      { max: 16, icon: ThermometerSnowflake, color: "#60a5fa", label: "Frio", range: "abaixo de 16 °C" },
      { max: 24, icon: Thermometer, color: "#34d399", label: "Agradável", range: "16 a 24 °C" },
      { max: 29, icon: Thermometer, color: "#f59e0b", label: "Quente", range: "24 a 29 °C" },
      { max: Infinity, icon: ThermometerSun, color: "#f87171", label: "Muito quente", range: "acima de 29 °C" },
    ],
  },
  {
    id: "humidity",
    title: "Umidade",
    icon: Droplet,
    unit: "%",
    decimals: 0,
    floor: 0,
    help: "Umidade relativa do ar.",
    aliases: ["umidade", "umido"],
    states: [
      { max: 30, icon: Droplet, color: "#f59e0b", label: "Seco", range: "abaixo de 30%" },
      { max: 60, icon: Droplet, color: "#34d399", label: "Confortável", range: "30 a 60%" },
      { max: 80, icon: Droplets, color: "#3b82f6", label: "Úmido", range: "60 a 80%" },
      { max: Infinity, icon: Bubbles, color: "#a78bfa", label: "Saturado", range: "acima de 80%" },
    ],
  },
  {
    id: "pressure",
    title: "Pressão",
    icon: Gauge,
    unit: "hPa",
    decimals: 0,
    help: "Pressão atmosférica. Só tem um ícone, então o estado aparece pela cor.",
    aliases: ["pressao", "atmosferica"],
    states: [
      { max: 1000, icon: Gauge, color: "#f87171", label: "Baixa", range: "abaixo de 1000 hPa" },
      { max: 1020, icon: Gauge, color: "#34d399", label: "Normal", range: "1000 a 1020 hPa" },
      { max: Infinity, icon: Gauge, color: "#f59e0b", label: "Alta", range: "acima de 1020 hPa" },
    ],
  },
  {
    id: "airQuality",
    title: "Qualidade do ar",
    icon: Wind,
    unit: "AQI",
    decimals: 0,
    floor: 0,
    help: "Índice de qualidade do ar. Quanto menor, melhor.",
    aliases: ["ar", "qualidade do ar", "qualidade", "vento"],
    states: [
      { max: 50, icon: WindArrowUp, color: "#34d399", label: "Boa", range: "abaixo de 50" },
      { max: 100, icon: Wind, color: "#f59e0b", label: "Moderada", range: "50 a 100" },
      { max: Infinity, icon: WindArrowDown, color: "#f87171", label: "Ruim", range: "acima de 100" },
    ],
  },
  {
    id: "luminosity",
    title: "Luminosidade",
    icon: Sun,
    unit: "%",
    decimals: 0,
    floor: 0,
    help: "Intensidade da luz ambiente.",
    aliases: ["luminosidade", "luz", "claridade"],
    states: [
      { max: 5, icon: Moon, color: "#6366f1", label: "Noite", range: "abaixo de 5%" },
      { max: 25, icon: Sunset, color: "#a78bfa", label: "Crepúsculo", range: "5 a 25%" },
      { max: 70, icon: CloudSun, color: "#60a5fa", label: "Nublado", range: "25 a 70%" },
      { max: Infinity, icon: Sun, color: "#f59e0b", label: "Sol forte", range: "acima de 70%" },
    ],
  },
  {
    id: "rain",
    title: "Chuva",
    icon: CloudRain,
    unit: "mm/h",
    decimals: 1,
    floor: 0,
    help: "Intensidade da chuva. Chuva com vento só aparece quando os dois sensores confirmam.",
    aliases: ["chuva", "chovendo", "chuvoso"],
    states: [
      {
        max: Infinity,
        icon: CloudRainWind,
        color: "#3b82f6",
        label: "Chuva com vento",
        range: "chuva e vento ao mesmo tempo",
        when: (all) => (all.rain ?? 0) >= 0.1 && (all.windSpeed ?? 0) >= 20,
      },
      { max: 0.1, icon: Cloud, color: "#94a3b8", label: "Sem chuva", range: "abaixo de 0,1 mm/h" },
      { max: 2, icon: CloudDrizzle, color: "#60a5fa", label: "Garoa", range: "0,1 a 2 mm/h" },
      { max: 10, icon: CloudRain, color: "#3b82f6", label: "Chuva", range: "2 a 10 mm/h" },
      { max: Infinity, icon: CloudLightning, color: "#a78bfa", label: "Tempestade", range: "acima de 10 mm/h" },
    ],
  },
];

export const SENSOR_BY_ID = Object.fromEntries(SENSOR_DEFS.map((def) => [def.id, def])) as Record<SensorId, SensorDef>;
