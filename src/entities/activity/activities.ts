import { Bike, Car, Dog, Flame, Footprints, PaintRoller, Shirt, Sprout, Umbrella, Wind } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Readings } from "../../shared/config/sensors";

export type VerdictStatus = "go" | "caution" | "stop";

export interface Verdict {
  status: VerdictStatus;
  reason: string;
}

type FullReadings = Record<"temperature" | "humidity" | "pressure" | "airQuality" | "luminosity" | "rain" | "windSpeed", number>;

interface Rule {
  applies: (readings: FullReadings) => boolean;
  reason: string;
}

export interface Activity {
  id: string;
  title: string;
  icon: LucideIcon;
  keywords: string[];
  stop: Rule[];
  caution: Rule[];
  allGood: string;
}

const NEUTRAL_READINGS: FullReadings = {
  temperature: 22,
  humidity: 50,
  pressure: 1013,
  airQuality: 0,
  luminosity: 50,
  rain: 0,
  windSpeed: 0,
};

const RAIN_THRESHOLD = 0.1;
const raining: Rule = { applies: (r) => r.rain >= RAIN_THRESHOLD, reason: "Está chovendo" };
const pollutedAir: Rule = { applies: (r) => r.airQuality > 100, reason: "Qualidade do ar ruim" };
const extremeTemperature: Rule = { applies: (r) => r.temperature > 38 || r.temperature < 0, reason: "Temperatura extrema" };

export const ACTIVITIES: Activity[] = [
  {
    id: "dry-clothes",
    title: "Secar roupa",
    icon: Shirt,
    keywords: ["roupa", "varal", "estender"],
    stop: [raining, { applies: (r) => r.humidity >= 80, reason: "Ar muito úmido, a roupa não seca" }],
    caution: [{ applies: (r) => r.humidity >= 65 || r.luminosity < 25, reason: "Vai secar devagar" }],
    allGood: "Ar seco e com luz suficiente",
  },
  {
    id: "run",
    title: "Correr",
    icon: Footprints,
    keywords: ["correr", "corrida", "caminhar", "caminhada", "treino", "treinar"],
    stop: [raining, pollutedAir, { applies: (r) => r.temperature > 32 || r.temperature < 5, reason: "Temperatura extrema" }],
    caution: [{ applies: (r) => r.temperature > 28 || r.airQuality > 50, reason: "Hidrate-se e reduza o ritmo" }],
    allGood: "Clima e ar favoráveis",
  },
  {
    id: "open-windows",
    title: "Abrir janelas",
    icon: Wind,
    keywords: ["janela", "ventilar", "arejar"],
    stop: [raining, { applies: (r) => r.airQuality > 100, reason: "Ar de fora está poluído" }],
    caution: [{ applies: (r) => r.airQuality > 50 || r.humidity >= 80, reason: "Ventile por pouco tempo" }],
    allGood: "Boa hora para ventilar",
  },
  {
    id: "wash-car",
    title: "Lavar o carro",
    icon: Car,
    keywords: ["carro", "lavar", "automovel"],
    stop: [raining],
    caution: [
      { applies: (r) => r.humidity >= 85, reason: "Pode ter chuva em breve" },
      { applies: (r) => r.luminosity >= 70, reason: "Sol forte deixa manchas" },
    ],
    allGood: "Sem chuva e sem sol forte",
  },
  {
    id: "barbecue",
    title: "Fazer churrasco",
    icon: Flame,
    keywords: ["churrasco", "churrasqueira", "assar"],
    stop: [raining],
    caution: [
      { applies: (r) => r.windSpeed >= 30, reason: "Vento forte atrapalha a brasa" },
      { applies: (r) => r.temperature > 34, reason: "Calor demais perto da churrasqueira" },
    ],
    allGood: "Tempo firme para o churrasco",
  },
  {
    id: "pool",
    title: "Ir à piscina ou praia",
    icon: Umbrella,
    keywords: ["praia", "piscina", "banho de sol"],
    stop: [raining, { applies: (r) => r.temperature < 20, reason: "Frio demais para água" }],
    caution: [{ applies: (r) => r.luminosity >= 85, reason: "Sol forte: use protetor" }],
    allGood: "Calor e sem chuva",
  },
  {
    id: "walk-dog",
    title: "Passear com o cachorro",
    icon: Dog,
    keywords: ["cachorro", "cao", "pet", "passear"],
    stop: [{ applies: (r) => r.temperature >= 35, reason: "Chão quente machuca as patas" }, { applies: (r) => r.rain >= 10, reason: "Tempestade" }],
    caution: [{ applies: (r) => r.temperature >= 30 || r.rain >= RAIN_THRESHOLD, reason: "Passeio curto e com água" }],
    allGood: "Clima bom para o passeio",
  },
  {
    id: "bike",
    title: "Andar de bicicleta",
    icon: Bike,
    keywords: ["bicicleta", "bike", "pedalar"],
    stop: [raining, pollutedAir],
    caution: [{ applies: (r) => r.temperature >= 32 || r.windSpeed >= 30, reason: "Calor ou vento forte" }],
    allGood: "Boas condições para pedalar",
  },
  {
    id: "water-plants",
    title: "Regar as plantas",
    icon: Sprout,
    keywords: ["planta", "regar", "jardim", "horta"],
    stop: [{ applies: (r) => r.rain >= 2, reason: "A chuva já está regando" }],
    caution: [{ applies: (r) => r.luminosity >= 80 && r.temperature >= 28, reason: "No sol forte a água evapora" }],
    allGood: "Boa hora para regar",
  },
  {
    id: "paint-wall",
    title: "Pintar uma parede",
    icon: PaintRoller,
    keywords: ["pintar", "tinta", "parede"],
    stop: [raining],
    caution: [{ applies: (r) => r.humidity >= 75, reason: "Tinta seca devagar com ar úmido" }],
    allGood: "Ar seco ajuda a secagem",
  },
];

const withDefaults = (readings: Readings): FullReadings => ({ ...NEUTRAL_READINGS, ...readings });

export const evaluateActivity = (activity: Activity, readings: Readings): Verdict => {
  const full = withDefaults(readings);
  const blocker = activity.stop.find((rule) => rule.applies(full));
  if (blocker) return { status: "stop", reason: blocker.reason };
  const warning = activity.caution.find((rule) => rule.applies(full));
  if (warning) return { status: "caution", reason: warning.reason };
  return { status: "go", reason: activity.allGood };
};

export const evaluateGeneric = (readings: Readings): Verdict => {
  const full = withDefaults(readings);
  if (extremeTemperature.applies(full)) return { status: "stop", reason: extremeTemperature.reason };
  return { status: "caution", reason: "Sem regra específica para isso; avalie pelas condições atuais" };
};
